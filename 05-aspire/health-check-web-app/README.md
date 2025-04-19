## Running Web App Locally

```
cd health-check-web-app
```

```
pip3 install pipenv
```

```
pipenv shell
```

```
pip3 intall -r reqruiements.txt
```

```
streamlit run app.py
```

## Docker

```
docker build -t foodprint-web-app .
```

```
docker run -p 8081:80 foodprint-web-app
```

## Help

#### Installing new packages

```
pipenv install <package_name>
pipenv requirements > requirements.txt
```