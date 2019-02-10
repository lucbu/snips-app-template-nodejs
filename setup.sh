#/usr/bin/env bash -e

if [ ! -e "./config.ini" ]
then
    cp config.ini.default config.ini
fi


VENV=venv

if [ -d "$VENV" ]
then
  nodeenv --requirements=requirements.txt --update $VENV
else
  nodeenv --node=10.15.1 --requirements=requirements.txt $VENV
fi

. $VENV/bin/activate
