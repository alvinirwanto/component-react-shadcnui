pipeline {

    agent any

    environment {
        PORTAINER_URL = 'http://10.50.74.14:9000' // Ganti dengan URL API Portainer Anda
        PORTAINER_API_TOKEN = "${env.PORTAINER_API_TOKEN_DEV}"
        PORTAINER_STACK_ID = ""
        STACK_NAME = "itms-web-dev-fix" // yang perlu di rubah untuk project awal
        DOCKER_COMPOSE_FILE = "docker-compose.yml"
        imageName = "itms-web-dev-fix" // yang perlu di rubah untuk project awal
        registry = "http://10.61.4.123:8087/"
        registryCredentials = "docker_credential_lokal"
    }
    stages {
        stage('Building image') {
          steps{
            script {                
                sh "sed -i 's+{{image_tag}}+${env.BUILD_NUMBER}+g' ${DOCKER_COMPOSE_FILE}"
                sh "cat ${DOCKER_COMPOSE_FILE}"
                dockerImage = docker.build imageName
                echo "Portainer Stack ID Building image ${env.BUILD_NUMBER}"
            }
          }
        }
        stage('Uploading to Nexus') {
         steps{  
             script {
                docker.withRegistry(registry, registryCredentials ) {
                dockerImage.push("${env.BUILD_NUMBER}")
                sh "docker rmi ${imageName}"
                echo "Portainer Stack ID Uploading to Nexus ${env.BUILD_NUMBER}"
              }
            }
          }
        }           
        stage('Get Portainer Stack ID') {
            steps {
                script {
                    try {
                        // Construct the Portainer API endpoint
                        def apiUrl = "${PORTAINER_URL}/api/stacks"

                        // Make a GET request to the Portainer API to retrieve stack information
                        def curlCommand = "curl -s -H 'x-api-key: ${PORTAINER_API_TOKEN}' ${apiUrl}"
                        def apiResponse = sh(script: curlCommand, returnStdout: true).trim()

                        // Parse the JSON response to find the stack ID based on the stack name
                        def stackInfo = readJSON(text: apiResponse)
                        def targetStack = stackInfo.find { it.Name == STACK_NAME }

                        if (targetStack != null) {
                            PORTAINER_STACK_ID = targetStack.Id.toString()
                            echo "Portainer Stack ID for '${STACK_NAME}': ${PORTAINER_STACK_ID}"                    
                        } else {
                            error "Portainer Stack '${STACK_NAME}' not found!"
                        }
                    } catch (Exception e) {
                        echo "Caught an error in Stage 1: ${e.message}"
                    }
                }
            }
        }
        stage('Delete Stack Portainer') {
            steps {
                script {
                    try {
                        def response = sh """
                            curl -X DELETE  \
                            -H "x-api-key: ${PORTAINER_API_TOKEN}" \
                            '${PORTAINER_URL}/api/stacks/${PORTAINER_STACK_ID}?endpointId=2'                         
                        """
                        echo "Response: ${response}"

                        PORTAINER_STACK_ID = "${PORTAINER_STACK_ID.toInteger() + 1}"
                    } catch (Exception e) {
                        echo "Caught an error in Stage 1: ${e.message}"
                    }
                }
            }
        }                      
        stage('Deploy to Portainer') {
            steps {
                script {
                    // Deploy the stack using Portainer API
                    def response = sh """
                        curl -X POST  \
                        -H "x-api-key: ${PORTAINER_API_TOKEN}" \
                        --form 'Name="${STACK_NAME}"' \
                        --form 'Env=""' \
                        --form 'file=@"${DOCKER_COMPOSE_FILE}"' \
                        --form 'endpointId=2' \
                        '${PORTAINER_URL}/api/stacks/create/standalone/file'                         
                    """
                    echo "Response: ${response}"
                }
            }
        }                 
    }
}
