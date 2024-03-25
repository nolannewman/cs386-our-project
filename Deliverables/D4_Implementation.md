## 1. Introduction
"Muscle Memory" empowers users to effortlessly track nutrition, manage weight, engage with a supportive community, learn about nutrition, plan personalized diets, seamlessly integrate fitness routines, set achievable health goals, and monitor progress—all within a single, user-friendly platform. Our initial consumer segments include individuals looking to track nutrition, manage weight, engage with the community, learn about nutrition, plan their diet, integrate fitness into their lifestyle, set health goals, and monitor their progress. The main features of the software allow users to create an account for logging and tracking their progress. Once registered, users can select their health objective—whether to bulk up, cut down, or maintain their current weight. Based on the selected goal, we provide tailored recommendations for daily calorie, protein, and carbohydrate intake.
## 2. Implemented requirements
Requirement: As a User, I want to be able to input the meals I have eaten and be able to track my calories. <br/>
Issue: https://github.com/nolannewman/cs386-our-project/issues/33 <br/> 
Pull request: https://github.com/nolannewman/cs386-our-project/pull/15 <br/>
Links to an external site. <br/>
Implemented by: Drake Stanton <br/>
Approved by: Nolan Newman <br/>
Print screen: A print screen that depicts the implemented feature (if applicable) <br/>
![Image](https://github.com/alonsojmnz/cs386-our-project/blob/main/Pictures/firstOne.png)



Requirement: As a User, I want to be able to interact with the website with a user interface that is easy to use. <br/>
Issue: https://github.com/nolannewman/cs386-our-project/issues/30 <br/> 
Pull request: https://github.com/nolannewman/cs386-our-project/pull/15 <br/>
Links to an external site. <br/>
Implemented by: Ryan Lucero <br/>
Approved by: Nolan Newman <br/>
Print screen: A print screen that depicts the implemented feature (if applicable) <br/>
![Image](https://github.com/alonsojmnz/cs386-our-project/blob/main/Pictures/secondOne.png)






Requirement: As a User, I want to be able to have access to educational resources to learn about how to eat better. <br/>
Issue: https: https://github.com/nolannewman/cs386-our-project/issues/31 <br/>
Pull request: https://github.com/nolannewman/cs386-our-project/pull/35 <br/>
Links to an external site. <br/>
Implemented by: Braden Wendt <br/>
Approved by: Drake Stanton <br/>
Print screen: A print screen that depicts the implemented feature (if applicable) <br/>
![Image](https://github.com/alonsojmnz/cs386-our-project/blob/main/Pictures/thirdOne.png)






Requirement: As a User, I want to be able to use a discussion board so I can interact with the fitness community about my fitness goals. <br/>
Issue: https: https://github.com/nolannewman/cs386-our-project/issues/32 <br/>
Pull request: https://github.com/nolannewman/cs386-our-project/pull/34 <br/>
Links to an external site. <br/>
Implemented by: Nolan Newman <br/>
Approved by: Drake Stanton <br/>
Print screen: A print screen that depicts the implemented feature (if applicable) <br/>
![Image](https://github.com/alonsojmnz/cs386-our-project/blob/main/Pictures/fourthOne.png)





Requirement: As a User, I want to be able to utilize a BMR calculator that can calculate how many calories I need to eat for bulking/maintaining. <br/>
Issue: https: https://github.com/nolannewman/cs386-our-project/issues/36 <br/>
Pull request: https://github.com/nolannewman/cs386-our-project/pull/27 <br/>
Links to an external site. <br/>
Implemented by: Nolan Newman <br/>
Approved by: Drake Stanton <br/>
Print screen: A print screen that depicts the implemented feature (if applicable) <br/>
![Image](https://github.com/alonsojmnz/cs386-our-project/blob/main/Pictures/fifthOne.png)




## 3. Tests
* The test framework we used was QUnit.
* https://github.com/nolannewman/cs386-our-project/tree/main/public/CalorieFunctions
* The class being tested is the calculator class using a BMR calculating method. The test checks for the functionality of the query parameters in the BMR calorie calculator
![Image](https://github.com/alonsojmnz/cs386-our-project/blob/main/Pictures/test.png)

The first verifies the accurate extraction of query parameters from a URL, while the second validates the precise calculation of Basal Metabolic Rate for a male individual with a bulking goal.

## 4. Adopted technologies
* AWS Cloud Computing- We chose AWS as we had used it before so we would not need to waste any time learning a new service. It is also cost effective and reliable which was important to us for our project.
* Embedded JavaScript- We used embedded javascript as it has Client-Side Validation, as well as good customization and interactivity, giving us the security and the client interaction that we needed for a login page on our fitness tracker.
* Node.js- We loved utilizing node.js because it is able to use javascript on the front and backend, which was a good setup for ourselves for the future of this project as well as the start. It also has very fast execution which was crucial to us as we are trying to make good progress, and also utilize the fact that it has real-time applications.
## 5. Learning/training
Strategies consisted of watching YouTube videos and looking at source pages for the packages. Learning the ejs took restructuring of our prior js code, as it proved to be more different than we imagined. AWS was already pretty well known amongst the six of us from past classes and past projects, but we refreshed each other’s knowledge by discussing how to work with it during our meetings. Node.js was the same as the embedded JavaScript in that we looked at videos and looked at various websites to see how to utilize it properly in our environment.
## 6. Deployment
http://ec2-3-92-24-153.compute-1.amazonaws.com:3000/ <br />
We are deploying our system using NodeJS with Express on AWS. The AWS machine is an Ubuntu VM we are connecting to through SSH and using only to host the website.
## 7. Licensing
We chose the MIT License as it is open for community adoption, and we wanted that to be how our project was built. There are minimal restrictions on how it can be used and modified. We figure we have benefited so much from open-source software that we wanted our project under the same license. A more private license felt a bit dramatic for the project we were building.Overall the simplicity and compatibility of the license made it seem like the right choice for our project.
## 8. README File
[README.md file](https://github.com/alonsojmnz/cs386-our-project/blob/main/README.md) <br />
[CONTRIBUTING.md file](https://github.com/alonsojmnz/cs386-our-project/blob/main/CONTRIBUTING.md) <br/>
[LICENSE file](https://github.com/alonsojmnz/cs386-our-project/blob/main/LICENSE.md) <br/>
[CODE_OF_CONDUCT.md file](https://github.com/alonsojmnz/cs386-our-project/blob/main/CODE_OF_CONDUCT.md) <br/>
## 9. Look & feel
Some of the approaches we adopted for designing the user interface include layout, design, and ease of use. We pride ourselves on the aesthetics of our system, believing it to be both user-friendly and visually appealing. To enhance user experience, we implemented features such as alternative text for images to accommodate scenarios where the page may not load properly. Additionally, we ensured our website is responsive, catering to various screen sizes. Our goal was to make our system as accessible as possible to a diverse range of users, regardless of their access method.
Here are some screenshots of our user friendly interface: 
![Image](https://github.com/alonsojmnz/cs386-our-project/blob/main/Pictures/lookNFeel.png)
![Image](https://github.com/alonsojmnz/cs386-our-project/blob/main/Pictures/lookNFeel2.png)


## 10. Lessons learned
Our team has gained valuable insights into teamwork, design, ideation, and the implementation of our system. These elements are crucial for enhancing our process of communication, implementation, and design. We are committed to focusing on these areas for improvement, as previously mentioned, to further refine our approach and outcomes.


## 11. Demo
https://www.youtube.com/watch?v=W-F-h2SEQrw



