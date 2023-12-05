How to run:
1. Install azurite (npm install -g azurite)
2. Run azurite (print "azurite" in powershell terminal)
3. Install dependencies (npm install in powershell terminal)
4. Run web-app (node index.js in terminal)

Features:
The application is implemented based on node.js express library

Admin panel emulator - http://localhost:3000/
-Place a photo to upload in "image" folder (<input type=file> does not contain full 
system path, that`s why all images loaded from fixed dir)

Image converter tool located in Services/Queue/QueueService.js folder, in convertQueueMonitor() method

Storefront emulator - http://localhost:3000/store (empty page if no categories)
-Click on category link to see category goods (empty page if no goods in selected category)

