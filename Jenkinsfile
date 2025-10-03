pipeline {
    agent any
    environment {
        IMAGE = "nikhilpesala/expense-tracker"
        TAG = "${env.BUILD_NUMBER}"
        NETWORK = "expense-net"
        DB_CONTAINER = "expense-tracker-postgres"
        APP_CONTAINER = "expense-tracker-expense-app"
        NODE_EXPORTER_CONTAINER = "expense-tracker-node-exporter"
        PROMETHEUS_CONTAINER = "expense-tracker-prometheus"
        GRAFANA_CONTAINER = "expense-tracker-grafana"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh "docker build -t ${IMAGE}:${TAG} ."
            }
        }

        stage('Test') {
            steps {
                sh "echo 'No tests yet, add later!'"
            }
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
      docker rm -f ${DB_CONTAINER} || true
      docker rm -f expense-tracker || true

      # Run Postgres container on host port 5433
      docker run -d --name ${DB_CONTAINER} --network ${NETWORK} \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=expenses \
        -p 5433:5432 postgres:15

      # Run expense app container
      docker run -d --name expense-tracker --network ${NETWORK} \
        -p 8085:8080 \
        -e DATABASE_URL='postgresql://postgres:postgres@${DB_CONTAINER}:5432/expenses' \
        ${IMAGE}:latest
    """
  }
}

    }
}
