
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                // Récup du référentiel sur Git
                git 'https://github.com/feres92/Projet_ticketing.git'
            }
        }
        stage('Build') {
            steps {
                // build du projet
                sh 'npm install' // 
            }
        }
        stage('Test') {
            steps {
                
                sh 'npm test' /
            }
        }
        stage('Deploy') {
            steps {
                sh 'npm run deploy' 
            }
        }
    }
    post {
        always {
            // nettoyage des ressources temporaires
            cleanWs()
        }
        success {
            // envoie d'une notification de réussite
            slackSend color: 'good', message: "Le pipeline Jenkins pour le projet ticketing a été exécuté avec succès !"
        }
        }
        failure {
            // envoie une notification d'échec
            slackSend color: 'danger', message: "Le pipeline Jenkins pour le projet ticketing a échoué. Veuillez vérifier les logs pour plus de détails."
        }
    }
}
