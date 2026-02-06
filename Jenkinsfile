pipeline {
    agent any

    environment {
        // Change this path to your actual project path on the server
        PROJECT_DIR = '/home/b6701970/1101103-SUT-Engineering-Asset-Hub'
    }

    triggers {
        // Check for Git changes every 1 minute
        pollSCM '* * * * *'
    }

    stages {
        stage('Deploy') {
            steps {
                script {
                    // We use 'sh' to run commands on the server directly
                    // accessing the existing directory to preserve Certbot certificates and DB volumes
                    sh """
                        cd ${PROJECT_DIR}
                        
                        echo "Configuring safe directory..."
                        git config --global --add safe.directory ${PROJECT_DIR}
                        
                        echo "Fetching latest changes..."
                        git fetch --all
                        git reset --hard origin/main
                        
                        echo "Deploying with Docker Compose..."
                        # Ensure we use the production compose file with secure env vars
                        docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
                        
                        echo "Cleaning up..."
                        docker image prune -f
                    """
                }
            }
        }
    }
}
