# resume

## Notes

- Theme is based on <https://github.com/PhillipChaffee/jsonresume-theme-one>

## Pre-reqs

Convert data to `resume.yaml` by downloading google sheet as `tsv`, then run `uv run sheets_to_yaml.py`.

## Usage

```bash
# install packages
yarn install

# dev
fd yaml | entr yarn build

# build
yarn build
```

See `resume.html` for output.
