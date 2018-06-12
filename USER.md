# EzMaster for end-users

EzMaster is a backoffice tool to manager docker applications without any IT skills.

![ezmaster demo](/doc/anim3.gif)

Once your [ops guy](OPERATION.md) installed an EzMaster on a server (ex: `my-ezmaster-server`), you can start using it.

EzMaster is a web application listening by default on the 35268 port or the server. So you should be able to connect to your ezmaster at http://my-ezmaster-server:35268/ (adjust `my-ezmaster-server` by your server hostname).

### How to test your first ezmaster application ?

* Add the application

  * Open ezmaster web interface: http://<Your ezmaster server IP>:35268
  * Click the "Applications" tab, and "Add Application" button
  * Then write the name of the application `inistcnrs/ezvis` and its version `6.8.13`
  * And click on "Create" and wait for the pull (it can take several minutes)

* Add the instance

  * Click on the "Instances" tab
  * Then click on "Add Instances" and choose `inistcnrs/ezvis:6.8.13` in the dropdown list
  * Enter "My first app" in the LongName field
  * Enter "myapp" in the first TechnicalName field, and "demo" in the second part
  * And click on "Create"

* Configure your instance
  * Then click on "Access..." to open ezvis application (it's empty but it's normal)
  * Then click on "Config" button and copy/past this file content: https://raw.githubusercontent.com/madec-project/showcase/master/demo_films/repository.json
  * Then click on "DATA" button and upload this file: https://github.com/madec-project/showcase/blob/master/demo_films/repository/films.csv
  * Then click again on "Access..." to open ezvis application and it should be filled with nice data

You finally should have something like this:

<img src="https://github.com/Inist-CNRS/ezmaster/blob/db46dccc532c3567b822f4f934b7cead0f4642f8/doc/ezvis_doc.png" height="250" />
