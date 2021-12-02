# Gaia Map

## requirement

- [tippecanoe](https://github.com/mapbox/tippecanoe)

## data

- [Gaia archives](https://gea.esac.esa.int/archive/)

## build

```shell
$ find ~/Downloads/GaiaSource_*.csv.gz | \
  xargs -t -I {} sh -c "cat {} | gunzip | node bin/build.js" | \
  tippecanoe -zg -o gaia.mbtiles --drop-densest-as-needed
```

## serve

```shell
$ nvm use
# serve tiles
$ npx tileserver-gl gaia.mbtiles --port 8080
# serve map
$ npx http-server docs -o
```
