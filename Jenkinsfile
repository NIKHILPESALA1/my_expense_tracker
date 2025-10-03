pipeline {
  agent any
  environment {
    IMAGE = "nikhilpesala/expense-tracker"
    TAG = "${env.BUILD_NUMBER}"
    NETWORK = "expense-net"
    DB_CONTAINER = "postgres"
    APP_CONTAINER = "expense-tracker-expense-app"
    PROM_CONTAINER = "prometheus"
    GRAF_CONTAINER = "grafana"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build') {
      steps { sh "docker build -t ${IMAGE}:${TAG} ." }
    }

    stage('Login to DockerHub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
        }
      }
    }

    stage('Push') {
      steps {
        sh "docker push ${IMAGE}:${TAG}"
        sh "docker tag ${IMAGE}:${TAG} ${IMAGE}:latest"
        sh "docker push ${IMAGE}:latest"
      }
    }

    stage('Deploy') {
      steps {
        sh """
          docker network create ${NETWORK} || true
          
          # Remove old containers if they exist
          docker rm -f ${DB_CONTAINER} ${APP_CONTAINER} ${PROM_CONTAINER} ${GRAF_CONTAINER} || true

          # Run Postgres
          docker run -d --name ${DB_CONTAINER} --network ${NETWORK} -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=expenses -p 5432:5432 postgres:15

          # Run Expense Tracker App
          docker run -d --name ${APP_CONTAINER} --network ${NETWORK} -p 8085:8080 -e DATABASE_URL='postgresql://postgres:postgres@${DB_CONTAINER}:5432/expenses' ${IMAGE}:latest

          # Run Prometheus
          docker run -d --name ${PROM_CONTAINER} --network ${NETWORK} -p 9090:9090 -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus

          # Run Grafana
          docker run -d --name ${GRAF_CONTAINER} --network ${NETWORK} -p 3000:3000 grafana/grafana
        """
      }
    }
  }
}
