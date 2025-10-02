pipeline {
  agent any
  environment {
    IMAGE = "nikhilpesala/expense-tracker"
    TAG = "${env.BUILD_NUMBER}"
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
          docker rm -f expense-tracker || true
          docker run -d --name expense-tracker -p 8080:8080 \
            -e DATABASE_URL='postgresql://postgres:postgres@postgres:5432/expenses' \
            ${IMAGE}:latest
        """
      }
    }
  }
}
