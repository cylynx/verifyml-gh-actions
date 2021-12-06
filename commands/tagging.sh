## Remove remote v1
git push --delete origin v1

## Remove the local v1 tag
git tag -d v1

## Tag the latest version
git tag $1

## Retag the v1 into latest commit
git tag v1

## Push all the tags onto the origin.
git push --tags
