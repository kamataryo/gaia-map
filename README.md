# Gaia Map

## requirement

- [tippecanoe](https://github.com/mapbox/tippecanoe)

## data

- [Gaia archives](https://gea.esac.esa.int/archive/)

## build

```shell
## gaia to S3
$ (nohup curl http://cdn.gea.esac.esa.int/Gaia/gedr3/gaia_source/ -sL | \
  grep -Eo 'href="GaiaSource_[0-9]*\-[0-9]*\.csv\.gz' | \
  sed -e 's/href="//' | \
  xargs -t -P2 -n1 -I {} sh -c "sleep 3 && curl http://cdn.gea.esac.esa.int/Gaia/gedr3/gaia_source/{} -sL | aws s3 cp - s3://gaia-edr3-download/{}") &
```

```shell
# s3 to mbtiles
$ aws s3api list-objects --bucket gaia-edr3-download | jq .Contents | jq -r 'map(.Key)[]' | xargs -t -P4 -n1 -I {} sh -c "echo {} | tee -a started.log | aws s3 cp s3://gaia-edr3-download/{} - | gunzip | node bin/build.js"
```

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
$ nvm use
# serve tiles
$ npx tileserver-gl gaia.mbtiles --port 8080
# serve map
$ npx http-server docs -o
```
