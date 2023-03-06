우분투에서 실행 해보자. 

# 프로그램 받아오기

```
git clone https://github.com/anpigon/upvu_web.git
```

git 이 없다는 오류가 나면

```
sudo apt install git
```
설치 후 다시 

```
git clone https://github.com/anpigon/upvu_web.git
```

# 받은 폴더로 이동

```
cd upvu_web/
```

# 필요한 파일들 설치

```

```

node와 yarn이 안깔려 있으면

```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -

sudo apt-get install -y nodejs

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt update && sudo apt install yarn

```

# 빌드하기

```
yarn 
yarn build
yarn start:prod
```

# 데스크톱 빌드하기
```
cd src/desktop
yarn
yarn build
yarn start:proc
```





 




