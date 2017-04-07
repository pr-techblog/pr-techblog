#!/usr/bin/env bash

branches='master' 'develop' 'newpost';

for branch in 'master' 'develop' 'newpost'
do
  git checkout ${branch}
  git pull origin ${branch}
done

echo "Fetched all branches and kept them in sync! Swtiching to newpost..."
git checkout newpost
