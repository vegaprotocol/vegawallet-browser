@Library('vega-shared-library') _

def commitHash = 'UNKNOWN'

pipeline {
    agent any
    options {
        skipDefaultCheckout true
        parallelsAlwaysFailFast()
    }
    stages {
        stage('approbation') {
            steps {
                sh 'printenv'
                checkout scm
                runApprobation ignoreFailure: false, vegawalletBrowserBranch: env.BRANCH_NAME, type: 'frontend'
            }
        }
    }
}
