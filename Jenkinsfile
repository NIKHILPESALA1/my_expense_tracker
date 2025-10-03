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
                    # Create network if it doesn't exist
                    docker network create ${NETWORK} || true

                    # ---- Postgres ----
                    docker rm -f ${DB_CONTAINER} || true
                    docker run -d --name ${DB_CONTAINER} --network ${NETWORK} -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=expenses -p 5435:5432 postgres:15

                    # ---- Expense App ----
                    docker rm -f ${APP_CONTAINER} || true
                    docker run -d --name ${APP_CONTAINER} --network ${NETWORK} -p 8085:8080 -e DATABASE_URL='postgresql://postgres:postgres@${DB_CONTAINER}:5432/expenses' ${IMAGE}:latest

                    # ---- Node Exporter ----
                    docker rm -f ${NODE_EXPORTER_CONTAINER} || true
                    docker run -d --name ${NODE_EXPORTER_CONTAINER} -p 9101:9100 prom/node-exporter:latest

                    # ---- Prometheus ----
                    docker rm -f ${PROMETHEUS_CONTAINER} || true
                    docker run -d --name ${PROMETHEUS_CONTAINER} --network ${NETWORK} -p 9090:9090 -v ${WORKSPACE}/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus:latest

                    # ---- Grafana ----
                    docker rm -f ${GRAFANA_CONTAINER} || true
                    docker run -d --name ${GRAFANA_CONTAINER} --network ${NETWORK} -p 3000:3000 grafana/grafana
                """
            }
        }
    }
}
