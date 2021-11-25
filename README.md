# Gaia Map

## requirement

- [tippecanoe](https://github.com/mapbox/tippecanoe)

## data

- [Gaia archives](https://gea.esac.esa.int/archive/)

## build

```shell
## one liner
$ curl http://cdn.gea.esac.esa.int/Gaia/gedr3/gaia_source/ -sL | \
  grep -Eo 'href="GaiaSource_[0-9]*\-[0-9]*\.csv\.gz' | \
  sed -e 's/href="//' | \
  xargs -I {} sh -c "sleep 5 && curl http://cdn.gea.esac.esa.int/Gaia/gedr3/gaia_source/{} -sL | gunzip | node bin/build.js" | \
  tippecanoe -zg -o gaia.mbtiles --drop-densest-as-needed
```

```shell
# Create NDGeoJSONs with the dowonloaded
$ find ~/Downloads/GaiaSource_*.csv.gz | \
  xargs -I {} sh -c "cat {} | gunzip | node bin/build.js" | \
  tippecanoe -zg -o gaia.mbtiles --drop-densest-as-needed
```

## serve

```shell
# serve tiles
$ npx tileserver-gl gaia.mbtiles --port 8080
# serve map
$ npx http-server docs -o