# D.7 Verification and Validation
## 1. Description
From the user perspective our system is a website that is used to set specific health goals and monitor daily caloric intake and nutritional values. Users can log their meals in the food log and track their steps in the exercise log. They have the option to set a goal from bulking, cutting, or maintaining and calculating the calories needed to achieve their goal. All of these values are then passed to the user’s personalized dashboard which comes with messages and a pie chart that change depending on how close they are to their goal for the day. Additionally, there are links to numerous health resources that can be used to learn and help users achieve their goals and a blog page where people can discuss how they are doing.

Internally, our system is a website with a Model View Controller architecture. We selected a Model View Controller architecture to try and keep the data logic separate from the view logic. This allowed us to ensure our MySQL database was only queried from the backend on our cloud hosting machine. In reference to the architecture, MySQL handled the model, ejs, html, and css handled the views, and a node JS server handled the controller. When a user tries to go to any page, the server first checks if the user is not logged in and blocks them from going to any page that has user based MySQL queries by redirecting to the user login page. When a user is logged in and accessing a page that requires database information, the view will send a request to the server to query the database and the results of that will then be returned to the view. Choosing EJS for the views that are database dependent was very useful as it allowed us to do operations on calorie values without having to call back to the server to query the database. In our system, all of this is happening on an AWS EC2 machine which was chosen for the free hosting enabling us to complete live tests. These tests included a simple unit test that essentially checks the user database functionality and an acceptance test that checked basic user side functionality. 

## 2. Verification
* The test framework we used to develop our unit tests was Jest. The code linked below uses a mock user in a mock SQL database to test updating a user’s email through the server ‘update-email’ POST method.<br>
* https://github.com/nolannewman/cs386-our-project/blob/main/Tests/app.test.js <br> <br> 
Sample unit test output: <br>
![Image](https://github.com/nolannewman/cs386-our-project/blob/main/Pictures/testPicOne.png) <br> <br>
* The test framework we used to develop our acceptance tests was pyppeteer in an IDLE environment. The code at the following link logins, goes to the food entry page, enters a food item, and confirms that the dashboard correctly records that entry. <br>
* https://github.com/nolannewman/cs386-our-project/blob/main/Tests/userTest.py <br> <br> 
Sample acceptance test output: <br>
![Image](https://github.com/nolannewman/cs386-our-project/blob/main/Pictures/testPicTwo.png) <br> <br>

## 3. Validation (User Evaluation)
### Script
1. What was your first impression when you logged into our application? Can you describe what you liked or didn't like about the login screen?

2. How do you find the layout and organization of our dashboard? Is there anything particularly intuitive or confusing about it?

3. We have different screens for various purposes like bulking, cutting, and food logging. How effective do you find these templates? Is there anything you would like to add or change?

4. Our application offers a quick calculation for Basal Metabolic Rate (BMR). How do you find the functionality of this feature? Is it easy to use?

5. In terms of tracking, currently, our app mainly focuses on steps for physical activity. Would you find it more beneficial if we expanded this to include other forms of exercise like weight lifting?

6. We also have a blog screen on our app. What are your thoughts about it? Is there any additional functionality or content you would like to see there?

7. Our application stores your data linked to your account. How important is this feature to you?

8. Moving to the design, how would you describe the overall aesthetic of our application? What do you think about the background image and visual elements on the homepage?

9. On a scale of one to ten, how would you rate the layout of our application?

10. Considering other meal tracking and calorie counting apps you might have used, like MyFitnessPal, how does our app compare? Are there specific features in these apps that you think we should incorporate?

11. How likely are you to continue using our application? If not very likely, what could change your mind?

12. How do you feel about our app being web-based? 

### Results
#### User1: <br>
 Likes:
* Likes the easy-to-follow login screen
* Likes the template for the bulking and cutting screen.
* BMR calculation is quick and easy 
* Dashboard screen is intuitive and organized
* Food log screen is easy to use and well integrated
* Likes how data is stored with the users account
* Homepage is clean and displays all necessary information conveniently. <br>

 Dislikes:
* Wants more functionality for other types of exercise, like weightlifting.
* Find the blog screen bland and wishes there was a journal feature.
* Design of the homepage is not interesting
* Rates the layout of the application a 7 out of 10.
* Is unlikely to use the app regularly because it lacks a mobile app. <br>

#### User 2: <br>
 Likes:
* Likes the option to choose plans and accurate calorie tracking.
* Appreciates the calorie burn tacking and the pie chart representation.
* Enjoys the functional login screen with password change option.
* Finds the layout well-organized. <br>

 Dislikes:
* Finds the styling basic and unappealing.
* Prefers using MyFitnessPal over this app due to better features. <br>

#### User 3: <br>
 Likes:
* Likes the simplicity and design of the website.
* Appreciates the simple and easy user interface.
* Values the accuracy and efficiency for different goals.
* Enjoys the social interaction features and access to nutritional resources.<br>

 Dislikes:
* Less likely to use it because its a website and not a mobile app.
* Wants a more blended and appealing logo.
* Desires a more interactive website experience.<br>
   
### Reflection:
Reflecting on the user feedback for our application reveals that the app's login and dashboard design, quick BMR calculation, and secure data storage are well-received, affirming that these functionalities work effectively. However, there is a notable demand for a mobile version to enhance accessibility and convenience, alongside a need for a more vibrant and engaging design, particularly on the homepage and blog screen. Users also suggested expanding functionality to include broader physical activity tracking, such as weight lifting. The feedback indicates that the app's learning curve is manageable, with users effectively utilizing intended features, suggesting good alignment with user expectations. Despite this, to increase user satisfaction and competitive edge, the application would benefit from design enhancements, expanded functionality, and a mobile platform transition. We did manage to complete our value proposition and hit our minimum value proposition but there is still room for improvement.
