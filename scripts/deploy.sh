#!/bin/bash

setup_git() {
  if [[ ! -z "$TRAVIS" ]]; then
    git config --global user.email "travis@travis-ci.org"
    git config --global user.name "Travis CI"
  fi
}

commit_files() {
  if [[ ! -z "$TRAVIS" ]]; then
    git checkout -b gh-pages
    git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
  else
    git checkout gh-pages
  fi
  git add . *.html
  git commit --message "Dev build."
}

upload_files() {
  if [[ ! -z "$TRAVIS" ]]; then
    git remote add origin-pages https://${GITHUB_TOKEN}@github.com/zealoushacker/unemployment-bubble-chart.git > /dev/null 2>&1
    git push --quiet --set-upstream origin-pages gh-pages
  else
    git push origin gh-pages
  fi
}

setup_git
commit_files
upload_files
