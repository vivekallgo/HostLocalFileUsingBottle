<html>
    <head><title>{{title}}</title></head>
    <body>
         <h1>{{title}}:</h1>
         <strong>Folder Name:</strong>
         <ul>                  
              <li>{{children['name']}}</li>
         </ul>
         <strong>File list:</strong>
         <ul>                  
              % for name in children['children']:
              <li><a href="{{name['name']}}">{{name['name']}}</a></li>              
              % end
         </ul>
    </body>
</html>