// 网站自动构建与部署（Jenkins 任务 lrcz-website）。
// 触发：lrcz 推送到 main，或 LCML-release、LcPlugins 的 docs/manual/ 有改动（三个仓库的 GitHub Webhook）。
// npm run check 通过后替换线上目录；任一步失败线上保持原样。上一版留在 index.prev，回退时互换目录名即可。
pipeline {
  agent any
  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }
  triggers {
    githubPush()
  }
  environment {
    PATH = "${env.JENKINS_HOME}/tools/node-24/bin:${env.PATH}"
    npm_config_registry = 'https://registry.npmmirror.com'
    // 1Panel 的 OpenResty 容器，宿主机 /1panel/www 挂在容器内 /www
    SITE_CONTAINER = '1Panel-openresty-HYpw'
    SITE_DIR = '/www/sites/www.lrcz.com'
  }
  stages {
    stage('关注手册仓库') {
      // 只为让这两个仓库 docs/manual/ 的推送能触发本任务；构建时手册仍经 GitHub API 下载
      steps {
        dir("${env.WORKSPACE}@manual/LCML-release") {
          checkout scmGit(
            branches: [[name: 'main']],
            userRemoteConfigs: [[url: 'git@github.com:LRCZCM/LCML-release.git', credentialsId: 'github-lrczcm-ssh']],
            extensions: [
              [$class: 'PathRestriction', includedRegions: 'docs/manual/.*', excludedRegions: ''],
              sparseCheckout(sparseCheckoutPaths: [[path: 'docs/manual']]),
              cloneOption(shallow: true, depth: 1, noTags: true, reference: ''),
            ],
          )
        }
        dir("${env.WORKSPACE}@manual/LcPlugins") {
          checkout scmGit(
            branches: [[name: 'main']],
            userRemoteConfigs: [[url: 'git@github.com:LRCZCM/LcPlugins.git', credentialsId: 'github-lrczcm-ssh']],
            extensions: [
              [$class: 'PathRestriction', includedRegions: 'docs/manual/.*', excludedRegions: ''],
              sparseCheckout(sparseCheckoutPaths: [[path: 'docs/manual']]),
              cloneOption(shallow: true, depth: 1, noTags: true, reference: ''),
            ],
          )
        }
      }
    }
    stage('检查并构建') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'github-lcplugins', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
          sh 'npm ci && npm run check'
        }
      }
    }
    stage('部署') {
      steps {
        sh '''
          docker exec "$SITE_CONTAINER" rm -rf "$SITE_DIR/index.new"
          docker cp dist/. "$SITE_CONTAINER:$SITE_DIR/index.new"
          docker exec "$SITE_CONTAINER" sh -c 'cd "$1" && cp index/404.html index.new/ && rm -rf index.prev && mv index index.prev && mv index.new index' _ "$SITE_DIR"
        '''
      }
    }
  }
}
