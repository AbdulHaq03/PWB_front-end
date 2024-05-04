var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var app = express();
app.use(bodyParser());
app.use(cors());
app.use(express.static('static'));
app.set('views',path.join(__dirname, 'views/manager'));
app.set('view engine','ejs','html');

app.get('/',function(req,res) {
    const pageTitle = 'User Name';
    const username = 'hamiz Haq'
    const currentDate = new Date().toDateString();
    const fruits = [
       {name : 'banana'},
       {name : 'apple'} ,
       {name: 'grape'}    
];
    res.render('manager',{pageTitle,username,currentDate,fruits});
});

app.get('/manager-teams',function(req,res) {
    const pageTitle = 'User Name';
    const username = 'hamiz Haq'
    const currentDate = new Date().toDateString();
    const fruits = [
       {name : 'banana'},
       {name : 'apple'} ,
       {name: 'grape'}    
];
    res.render('manager-teams',{pageTitle,username,currentDate,fruits});
});

app.get('/projects',function(req,res){
    const pageTitle = 'User Name';
    const username = 'hamiz Haq'
    const currentDate = new Date().toDateString();
    const fruits = [
       {name : 'banana'},
       {name : 'apple'} ,
       {name: 'grape'}    
];
    res.render('projects',{pageTitle,username,currentDate,fruits});
});

app.get('/create-project',function(req,res){
    res.render('create-project');
});
app.get('/delete-project',function(req,res){
    res.render('delete-project');
});
app.get('/mgr_tasks',function(req,res){
    const pageTitle = 'User Name';
    const username = 'hamiz Haq'
    const currentDate = new Date().toDateString();
    const fruits = [
       {name : 'banana'},
       {name : 'apple'} ,
       {name: 'grape'}    
];
    res.render('mgr_tasks',{pageTitle,username,currentDate,fruits});
});
app.get('/create-task',function(req,res){
    res.render('create-task');
});

app.get('/pending-task',function(req,res){
    const pageTitle = 'User Name';
    const username = 'hamiz Haq'
    const currentDate = new Date().toDateString();
    const fruits = [
       {name : 'banana'},
       {name : 'apple'} ,
       {name: 'grape'}    
];
    res.render('pending-task',{pageTitle,username,currentDate,fruits});

});
app.get('/delete-task',function(req,res){
    res.render('delete-task');
});
app.get('/approve-task',function(req,res){
    res.render('approve-task');
});
app.get('/manager',function(req,res){
    const pageTitle = 'User Name';
    const username = 'hamiz Haq'
    const currentDate = new Date().toDateString();
    const fruits = [
       {name : 'banana'},
       {name : 'apple'} ,
       {name: 'grape'}    
];
    res.render('manager');
});

// app.get('/delete_team',function(req,res){
//     res.render('delete_team');
// });
// app.get('/delete_user',function(req,res){
//     res.render('delete_user');
// });
// app.get('/projects',function(req,res){
//     const pageTitle = 'User Name';
//     const username = 'hamiz Haq'
//     const currentDate = new Date().toDateString();
//     const fruits = [
//        {name : 'banana'},
//        {name : 'apple'} ,
//        {name: 'grape'}    
// ];
//     res.render('projects',{pageTitle,username,currentDate,fruits});
// });
// app.get('/remove_from_team',function(req,res){
//     res.render('remove_from_team');
// });
// app.get('/teams',function(req,res){
//     const pageTitle = 'User Name';
//     const username = 'hamiz Haq'
//     const currentDate = new Date().toDateString();
//     const fruits = [
//        {name : 'banana'},
//        {name : 'apple'} ,
//        {name: 'grape'}    
// ];
//     res.render('teams',{pageTitle,username,currentDate,fruits});
// });

app.listen(8000);