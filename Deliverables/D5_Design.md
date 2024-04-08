# D.5 Design

## 1. Description

"Muscle Memory" empowers users to effortlessly track nutrition, manage weight, engage with a supportive community, learn about nutrition, plan personalized diets, seamlessly integrate fitness routines, set achievable health goals, and monitor progress—all within a single, user-friendly platform. Our initial consumer segments include individuals looking to track nutrition, manage weight, engage with the community, learn about nutrition, plan  their diet, integrate fitness into their lifestyle, set health goals, and monitor their progress. The main features of the software allow users to create an account for logging and tracking their progress. Once registered, users can select their health objective—whether to bulk up, cut down, or maintain their current weight. Based on the selected goal, we provide tailored recommendations for daily calorie, protein, and carbohydrate intake.
## 2. Architecture
![Image](https://github.com/nolannewman/cs386-our-project/blob/main/Pictures/D5_Architecture_Picture.png)
We chose this type of architecture because it allows for safe access of user data by separating the user from the database, having them interact with it through the server under safe conditions. Additionally, the database can then provide information based on a serialized user session to other pages of the website allowing for more functionality with less overhead.
## 3. Class diagram
![Image](https://github.com/nolannewman/cs386-our-project/blob/main/Pictures/D5_Class_Diagram.jpg)
## 4. Sequence diagram
Use Case: Setting Health Goals and Receiving Tailored Recommendations
Description: The user wants to set health goals (bulk up, cut down, or maintain weight) and receive tailored recommendations for daily calorie, protein, and carbohydrate intake based on the selected goal
![Image](https://github.com/nolannewman/cs386-our-project/blob/main/Pictures/D5_Sequence_Diagram.png)
## 5. Design Patterns
Structural Design Patterns - UML Class Diagram for database schema
https://github.com/nolannewman/cs386-our-project/blob/main/userDb.sql
![Image](https://github.com/nolannewman/cs386-our-project/blob/main/Pictures/D5_Design_Patterns_Diagram.png)
Behavioral Design Pattern - UML Class Diagram for calorie counter
https://github.com/nolannewman/cs386-our-project/blob/main/views/calories.ejs
![Image](https://github.com/nolannewman/cs386-our-project/blob/main/Pictures/D5_Design_Patterns_Diagram_2.png)
## 6. Design Principles
Single Responsibility Principle (SRP) is observed through the distinct separation of functionalities into specific packages, such as UserManagement for handling user accounts and NutritionTracking for managing meal logs and calorie counts, ensuring that each component focuses on a single task. Open/Closed Principle (OCP) is applied by designing the system in a way that allows for the extension of functionalities, like adding new types of nutrition tracking, without altering existing code, thus facilitating easy updates and additions. Although the package diagram does not explicitly showcase class hierarchies, adherence to the Liskov Substitution Principle (LSP) would ensure that any subclass can replace its parent class without affecting the system's correctness, implying a well-thought-out inheritance structure. The design suggests an application of the Interface Segregation Principle (ISP) by implying that specific interfaces for different functionalities would prevent clients from depending on unnecessary methods, thus maintaining a clean and focused client-interface interaction. Finally, the Dependency Inversion Principle (DIP) is implied through the relationship between high-level modules and the Database package, suggesting that high-level functionalities depend on abstractions rather than concrete implementations of the database layer, facilitating easy maintenance and scalability.
