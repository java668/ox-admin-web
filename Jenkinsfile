pipeline {
    agent any
    stages {
        stage('拉取代码') {
            steps {
                echo '=============拉取代码============='
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: '38dd7ab4-5c12-4624-b2d3-ea1d43e53d6a', url: 'git@github.com:java668/ox-admin-web.git']])
                echo '=============拉取代码完成============='
            }
        }
        stage('打包') {
            steps {
                echo '=============打包============='
                //使用NodeJS的npm进行打包
                sh '''
                  npm install
                  npm run build
                '''

            }
        }
        stage('部署网站') {
            steps {
                // 部署网站
                echo "=============部署网站============="
                sshPublisher(publishers: [sshPublisherDesc(
                                    configName: '81.69.220.64',
                                    transfers: [sshTransfer(cleanRemote: false, excludes: '',
                                                            execCommand: '',
                                                            execTimeout: 120000,
                                                            flatten: false,
                                                            makeEmptyDirs: false,
                                                            noDefaultExcludes: false,
                                                            patternSeparator: '[, ]+',
                                                            remoteDirectory: '/usr/local/ox-admin/ox-admin-web',
                                                            remoteDirectorySDF: false,
                                                            removePrefix: 'dist',
                                                            sourceFiles: 'dist/**')],
                                    usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])

            }
        }
    }
}
