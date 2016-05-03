# ezmaster

Administration of docker applications without any IT skills.

## Install and run

Without docker:

```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
npm install
npm start
```

Then navigate to [http://127.0.0.1:3000](http://127.0.0.1:3000)


## Install and run for developements

### Without without npm/node
To start ezmaster from a local git clone, you can follow these steps (needs nodejs and mongodb installed localy):

```shell
git clone https://github.com/Inist-CNRS/ezmaster.git
cd ezmaster
make install
make run-debug
# the app is listening at http://127.0.0.1:3000/
# then open another terminal and your can freely edit the code
```

### Adding a default instance

You can add a default instance with the button 'Add an instance'.

### Changing timeout

In castor-core module, in file "starter.js", please add 
```shell 
srv.timeout = 1E6;
```
at line 236.


