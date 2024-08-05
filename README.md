# NODE.js-based application with end to end CI/CD pipeline
> **This project is a Node.js-based web application that uses the Express framework for building a RESTful API. The application is designed to interact with a MongoDB database for data storage and Redis for session management,
> and includes an end-to-end CI/CD pipeline using Jenkins and Argo CD for continuous integration and deployment.**
# Installation on EC2 Instance

## AWS EC2 Instance

- Go to AWS console
- Go to instances
- Launch Instance
> You need to use t2.large because we're going to use docker as an agent for our pipeline which uses more CPU & RAM.

### Install Jenkins.
***
Pre-Requisites:
 - Java (JDK)
 - postman

### Run the below commands to install Java and Jenkins on the EC2 server
***
Install Java

```
sudo apt update
sudo apt install openjdk-17-jre
```
### Verify Java is Installed
***
```
java -version

```
### Install Jenkins
***
```
curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update
sudo apt-get install jenkins
```
**Note:** By default, You will not be able to access `Jenkins` in the external world due to the inbound traffic restriction by AWS. Open port 8080 in the inbound traffic rules as show below.

- EC2 > Instances > Click on <Instance-ID>
- In the bottom tabs -> Click on Security
- Security groups
- Add inbound traffic.
  
  |Type|Port range|Source|     
  |----|----------|-------|    
  |Custom TCP|8080|Anywhere-IPv4|

### Login to Jenkins using the below URL:
***
http://`ec2-instance-public-ip-address`:8080    [You can get the ec2-instance-public-ip-address from your AWS EC2 console page]

After you login to Jenkins, 
- Run the command to copy the Jenkins Admin Password - `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`
- Enter the Administrator password
- Click on Install suggested plugins
- Wait for the Jenkins to Install suggested plugins
- Create First Admin User or Skip the step [If you want to use this Jenkins instance for future use-cases as well, better to create admin user]
- Jenkins Installation is Successful. You can now starting using the Jenkins

## Install the Docker Pipeline plugin in Jenkins:
***
   - Log in to Jenkins.
   - Go to Manage Jenkins > Manage Plugins.
   - In the Available tab, search for "Docker Pipeline".
   - Select the plugin and click the Install button.
   - Restart Jenkins after the plugin is installed.(To restart jenkins just add `/restart` at the url example:`http://ec2-instance-public-ip-address:8080/restart`)
   - Wait for the Jenkins to be restarted.

## Docker Slave Configuration
***
Run the below command to Install Docker

```
sudo apt update
sudo apt install docker.io
```
 
### Grant Jenkins user and Ubuntu user permission to docker deamon.
***
```
sudo su - 
usermod -aG docker jenkins
usermod -aG docker ubuntu
systemctl restart docker
```

Once you are done with the above steps, it is better to restart Jenkins.
***
```
http://<ec2-instance-public-ip>:8080/restart

```

The docker agent configuration is now successful.
