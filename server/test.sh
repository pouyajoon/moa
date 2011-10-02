#!/bin/bash

LIMIT=$1

for ((a=1; a <= $1 ; a++))  # Double parentheses, and "LIMIT" with no "$".
do
  #echo -n "$a "
  curl "http://pouya:8080/create/q$a"
  sleep $2
done
echo 
