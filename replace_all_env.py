#/usr/bin/env python

import os
import subprocess

EXCLUDE_OS_VAR = ["_", "."]


def get_envs():
    return os.environ

def get_env_key_value(env):
    return "{}={}".format(env, os.getenv(env))

def create_sed_command(env, filepath):
    return "sed -i '/{}/c {}' {}".format(
        env, get_env_key_value(env), filepath)

def check_var_exists(var, filepath):
    with open(filepath, 'r') as datafile:
        for line in datafile:
            if var in line:
                return True

def main(filepath):
    for env in get_envs():
       if check_var_exists(env, filepath) and not env in EXCLUDE_OS_VAR:
           command = create_sed_command(env, filepath)
           print("Executing command {}...".format(command))
           subprocess.call(command, shell=True)

if __name__ == '__main__':
    main(".env")

