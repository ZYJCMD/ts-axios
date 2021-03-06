#！/usr/bin/env sh
set -e
echo "Enter release version: "
read version
read -p "Releasing $VERSION -are you sure? (y/n)" -n 1 -r
echo 
if [[$REPLY=~^[Yy]$]]
then
    echo "Releasing $VERSION ..."

    gid add -A
    git commit -m "[build] $VERSION"
    npm version $VERSION --message "[release] $VERSION"
    git push origin master

    npm publish
fi
    