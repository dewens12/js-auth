#!/bin/bash

# build the docs
npm run docs

# commit
git add API.md
git commit -m "chore: update docs for latest version"

# bump version based on commit history
npm run standard-version
# patch version (1.0.0)
PACKAGE_VERSION_PATCH=$( sed -n 's/.*"version": "\(.*\)",/\1/p' package.json )
# minor version (v1.0)
PACKAGE_VERSION_MINOR=$( echo ${PACKAGE_VERSION_PATCH} | awk -F'.' '{print "v"$1"."$2}' )

# npm publish
npm publish

# push to cdn
aws s3 cp ./dist s3://cdn.airmap.io/js/auth/${PACKAGE_VERSION_PATCH}/ --recursive --exclude="*.DS_Store" --acl=public-read --profile default
aws s3 cp ./dist s3://cdn.airmap.io/js/auth/${PACKAGE_VERSION_MINOR}/ --recursive --exclude="*.DS_Store" --acl=public-read --profile default
