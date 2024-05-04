var http = require('http');
var express = require('express');
var app = express();
var sequel = require('mysql2');
var connection = require('./db');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var app = express();
var uname = "";
var urole = "";
var uid = "";
const port = 8080

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(express.static('static'));
app.set('views',path.join(__dirname, '/views'));
app.set('view engine','ejs', 'html');

app.get("/", function(req, res)
{
    res.sendFile(__dirname + '/home.html');
});

app.get('/member_home', function(req, res){
    if (urole == 'member'){
        const UserName = uname;
        res.render('member-home', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not member');
    }
});

app.get('/member_tasks', function(req, res){
    if (urole == 'member'){
        var tasks = null;
        connection.query('select * from task t join user_tasks ut on t.id = ut.tid where ut.uid = \''+uid+'\';', function(err, results){
            if (err)throw err;
            res.render('member-task', { results });
        });
    }
    else{
        res.status(403).send('Access Denied, user was not member');
    }
});

app.get('/customer_home', function(req, res){
    if (urole == 'customer'){
        const UserName = uname;
        res.render("customer-home", { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not customer');
    }
});

app.get('/c_tasks', function(req, res){
    if (urole == 'customer') {
        const UserName = uname;
        res.render('customer-task', { UserName });
    }
    else {
        res.status(403).send('Access denied, user was not customer');
    }
})

app.get('/customer_tasks', function(req, res){
    if (urole == 'customer'){
        var type = req.query.type;
        var priority = req.query.priority;
        var status = 'Assigned';
        var due = req.query.due;
        var desc = req.query.desc;
        var comments = req.query.comments;
        var attachments = req.query.attachments;
        var cid = uid;
        let query = 'insert into task (type, priority, status, due, description, comments, attachments, cid) values (\"'+type+"\", \""+priority+"\", \""+status+"\", \""+due+"\" , \""+desc+"\", \""+comments+"\", \""+attachments+"\", \""+cid+"\");";
        connection.query(query, function(err, results){
            if (err) throw err;
        });
        res.redirect('/customer_home');
    }
    else{
        res.status(403).send('Access Denied, user was not customer');
    }
});

app.get('/mgr', function(req, res) {
    if (urole == 'manager') {
        const UserName = uname;
        res.render('manager/manager', { UserName });
    }
    else {
        res.status(403).send('Access Denied, user was not manager');
    }

});
  
app.get('/mgr_home', function(req, res)
{
    if (urole == 'manager'){
        res.redirect('/mgr')
    }
    else{
        res.status(403).send('Access Denied, user was not manager');
    }
});

app.get('/mgr_tasks', function(req, res)
{
    if(urole == 'manager'){
        const UserName = uname;
        var teams = null;
        connection.query('select * from task where cid = \"'+uid+'\";', function(err, results){
            if (err) throw err;
            else{
                console.log(results);
                res.render('manager/mgr_tasks', { UserName, results });
            }
        });
        
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/mgr_teams', function(req, res){
    if (urole == 'manager'){
        const UserName = uname;
        var teams = null;
        connection.query('select * from team where lid = \"'+uid+"\";", function(err, results){
            if (err) throw err;
            else{
                console.log(results);
                res.render('manager/manager-teams', { UserName, results });
            }
        });
    }
    else{
        res.status(403).send('Access Denied, user was not manager');
    }
});

app.get('/mgr_projects', function(req, res){
    if (urole == 'manager'){
        const UserName = uname;
        var projs = null;
        connection.query('select * from project where mgrid = \"'+uid+"\";", function(err, results){
            if (err) throw err;
            else{
                console.log(results);
                res.render('manager/projects', { UserName, results });
            }
        });
    }
    else{
        res.status(403).send('Access Denied, user was not manager');
    }
});

app.get('/mgr_c_project', function(req, res){
    if (urole == 'manager'){
        const UserName = uname;
        res.render('manager/create-project', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not manager');
    }
});

app.get('/mgr_create_project', function(req, res){
    if (urole == 'manager'){
        var name = req.query.name;
        var cdate = new Date();
        var year = cdate.getFullYear();
        var month = cdate.getMonth() + 1;
        var day = cdate.getDate();
        if (Number(day) <= 9) {
            day = "0" + day;
        }
        if (Number(month) <= 9) {
            month = "0" + month;
        }
        var creation = year + "-" + month + "-" + day;
        var mgr = req.query.mgr;
        connection.query('select role from user where id = \"'+mgr+"\";", function(err, results){
            if (err) throw err;
        });
        let query = "insert into project (name, creation, mgrid) values (\""+name+"\", \""+creation+"\", \""+mgr+"\");";
        connection.query(query, function(err, results){
            if (err) throw err;
        });
        res.redirect('/mgr_projects');
    }
    else{
        res.status(403).send('Access Denied, user was not manager');
    }
});

app.get('/mgr_d_project', function(req, res){
    if (urole == 'manager'){
        const UserName = uname;
        res.render('manager/delete-project', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not manager');
    }
});

app.get('/mgr_delete_project', function(req, res){
    if (urole == 'manager'){
        var pid = req.query.pid;
        let query = "select * from project where id = \""+pid+"\";";
        connection.query(query, function(err, results){
            if (err) throw err;
        });
        let query1 = "delete from user_project where pid = \""+pid+"\";";
        connection.query(query1, function(err, results){});
        let query2 = "delete from team_project where pid = \""+pid+"\";";
        connection.query(query2, function(err, results){});
        let query3 = 'delete from project where id = \"'+pid+"\";";
        connection.query(query3, function(err, res){});
        res.redirect('/mgr_projects')
    }
    else{
        res.status(403).send('Access denied, user was not manager');
    }
});

app.get('/mgr_c_tasks', function(req, res){
    if (urole == 'manager'){
        const UserName = uname;
        res.render('manager/create-task', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not manager');
    }
});

app.get('/mgr_create_task', function(req, res){
    if (urole == 'manager'){
        var type = req.query.type;
        var priority = req.query.priority;
        var status = 'Assigned';
        var due = req.query.due;
        var desc = req.query.desc;
        var comments = req.query.comments;
        var attachments = req.query.attachments;
        var cid = uid;
        let query = 'insert into task (type, priority, status, due, description, comments, attachments, cid) values (\"'+type+"\", \""+priority+"\", \""+status+"\", \""+due+"\" , \""+desc+"\", \""+comments+"\", \""+attachments+"\", \""+cid+"\");";
        connection.query(query, function(err, results){
            if (err) throw err;
        });
        res.redirect('/mgr_tasks');
    }
    else{
        res.status(403).send('Access Denied, user was not manager');
    }
});

app.get('/mgr_d_tasks', function(req, res){
    if (urole == 'manager'){
        const UserName = uname;
        res.render('manager/delete-task', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not manager');
    }
});

app.get('/mgr_delete_task', function(req, res){
    if (urole == 'manager'){
        var tid = req.query.tid;
        connection.query('select cid from task where id = \"'+tid+'\";', function(err, results){
            if (err) throw err;
        });
        let query='delete from user_task where tid = \"'+tid+"\";";
        connection.query(query, function(err, result){});
        let query1='delete from task where id = \''+tid+'\';';
        connection.query(query1, function(err, result){});
        res.redirect('/mgr_tasks');
    }
    else{
        res.status(403).send('Access Denied, user was not manager');
    }
});

app.get('/mgr_a_tasks', function(req, res){
    if (urole == 'manager'){
        const UserName = uname;
        res.render('manager/approve-task', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not manager');
    }
});

app.get('/mgr_approve_task', function(req, res){
    var id = req.query.tid;
    connection.query('update task set status = \'Assigned\' where id = \''+id+'\';', function(err, results){
        if (err)throw err;
    });
    res.redirect('/mgr_tasks');
})

app.get('/mgr_p_tasks', function(req, res){
    if (urole == 'manager'){
        var tasks;
        const UserName = uname;
        connection.query('select * from task where cid = \''+uid+'\' and status = \'Pending\';', function(err, results){
            if (err) throw err;
            console.log(results);
            res.render('manager/pending-task', { results, UserName });
        });
    }
    else{
        res.status(403).send('Access Denied, user was not manager');
    }
});

app.get('/admin_home', function(req, res)
{
    if(urole == 'admin')
    {
        const UserName = uname;
        res.render('admin/admin', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/admin_users', function(req, res){
    if (urole == 'admin'){
        let query = "select * from user;";
        const pageTitle = uname + " ";
        const UserName = uname;
        const currentDate = new Date().toDateString();
        connection.query(query, function(err, results){
            res.render('admin/admin_users', { results, pageTitle, UserName, currentDate});
        });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/admin_assign_team',function(req,res){
    if (urole == 'admin')
    {
        const UserName = uname;
        res.render('admin/assign_team', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/assign_team', function(req, res){
    if (urole == 'admin'){
        var team = req.query.team;
        var uid = req.query.uid;
        let query = "insert into user_team (uid, tid) values (\""+uid+"\", \""+team+"\");";
        connection.query(query, function(err, results){
            if (err){
                return res.redirect('/admin_teams');
            }
        });
    }
    else{
        res.status(403).send("Access Denied, user was not admin");
    }
});

app.get('/admin_task',function(req,res){
    if (urole == 'admin'){
        let query = "select * from task;";
        const pageTitle = uname + " ";
        const UserName = uname;
        const currentDate = new Date().toDateString();
        connection.query(query, function(err, results){
            res.render('admin/admin_task', { results, pageTitle, UserName, currentDate});
        });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/admin_create_project',function(req,res){
    if (urole == 'admin')
    {
        const UserName = uname;
        res.render('admin/create_project', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/create_project', function(req, res){
    if (urole == 'admin'){
        var name = req.query.name;
        var cdate = new Date();
        var year = cdate.getFullYear();
        var month = cdate.getMonth() + 1;
        var day = cdate.getDate();
        if (Number(day) <= 9) {
            day = "0" + day;
        }
        if (Number(month) <= 9) {
            month = "0" + month;
        }
        var creation = year + "-" + month + "-" + day;
        var mgr = req.query.mgr;
        connection.query('select role from user where id = \"'+mgr+"\";", function(err, results){
            if (err) throw err;
        });
        let query = "insert into project (name, creation, mgrid) values (\""+name+"\", \""+creation+"\", \""+mgr+"\");";
        connection.query(query, function(err, results){
            if (err) throw err;
        });
        res.redirect('/admin_projects')
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/admin_delete_project',function(req,res) {
    if (urole == 'admin')
    {
        const UserName = uname;
        res.render('admin/delete_project', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/delete_project', function(req, res){
    if (urole == 'admin'){
        var pid = req.query.pid;
        let query = "select * from project where id = \""+pid+"\";";
        connection.query(query, function(err, results){
            if (err) throw err;
        });
        let query1 = "delete from user_project where pid = \""+pid+"\";";
        connection.query(query1, function(err, results){});
        let query2 = "delete from team_project where pid = \""+pid+"\";";
        connection.query(query2, function(err, results){});
        let query3 = 'delete from project where id = \"'+pid+"\";";
        connection.query(query3, function(err, res){});
        res.redirect('/admin_projects')
    }
    else{
        res.status(403).send('Access denied, user was not admin');
    }
});

app.get('/admin_create_teams',function(req,res){
    if (urole == 'admin')
    {
        const UserName = uname;
        res.render('admin/create_teams', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/create_team', function(req, res){
    if (urole == 'admin'){
        var lead = req.query.lid;
        var user = req.query.id;
        let query = "insert into team (id, lid) values (\""+user+"\", \""+lead+"\");";
        connection.query(query, function(err, results){
                if (err) throw err;
        });
        res.redirect('/admin_teams');
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});


app.get('/admin_create_user',function(req,res){
    if (urole == 'admin')
    {
        const UserName = uname;
        res.render('admin/create_user', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/create_user', function(req, res){
    if (urole == 'admin'){
        var username = req.query.username;
        var email = req.query.email;
        var password = req.query.password;
        var role = req.query.role;
        var gender = req.query.gender;
        var address = req.query.address;
        var dob = req.query.dob;
        let query = "insert into user (name, role, address, dob, gender, email, password) values (\""+username+"\", \""+role+"\", \""+address+"\", \""+dob+"\", \""+gender+"\", \""+email+"\", \""+password+"\")";
        connection.query(query, function(err, results){
            if (err) throw err;
        });
        res.redirect('/admin_users')
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/admin_delete_team',function(req,res){
    if (urole == 'admin')
    {
        const UserName = uname;
        res.render('admin/delete_team', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/remove_team', function(req, res){
    if (urole == 'admin'){
        var tid = req.query.tid;
        let query = "select * from team where lid = \""+tid+"\";";
        connection.query(query, function(err, results){
            if (err){
                res.send("The team id was incorrect, please try again");
                return res.redirect('/admin_delete_team');
            }
        });
        let query1 = "delete from user_team where tid = \""+tid+"\";";
        connection.query(query1, function(err, results){});
        let query2 = "delete from team_project where tid = \""+tid+"\";";
        connection.query(query2, function(err, results){});
        let query3 = "delete from team where lid = \""+tid+"\";";
        connection.query(query3, function(err, res){});
        res.redirect('/admin_teams');
    }
});

app.get('/admin_delete_user',function(req,res){
    if (urole == 'admin')
    {
        const UserName = uname;
        res.render('admin/delete_user', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/delete_user', function(req, res){
    if (urole == 'admin'){
        var uid = req.query.uid;
        let details = "select * from users where id = \""+uid+"\";";
        connection.query(details, function(err, results){
            if (err){
                res.redirect('/admin_users')
            }
            details = results;
        });
        if (details.role == 'member'){
            let query = "delete from user_tasks where uid=\""+uid+"\";";
            connection.query(query, function(err, results){
                if (err) throw err;
            });
            let query1 = "delete from user_team where uid=\""+uid+"\";";
            connection.query(query1, function(err, results){
                if (err) throw err;
            });
        }
        else if (details.role == 'manager'){
            let query = "delete from user_project where uid = \""+uid+"\";";
            connection.query(query, function(err, results){
                if (err) throw err;
            });
        }
        let query = "delete from user where id = \""+uid+"\";";
        connection.query(query, function(err, results){
                if (err) throw err;
        });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/admin_projects',function(req,res){
    if (urole == 'admin'){
        let query = "select * from project;";
        const pageTitle = uname + " ";
        const UserName = uname;
        const currentDate = new Date().toDateString();
        connection.query(query, function(err, results){
            res.render('admin/projects', { results, pageTitle, UserName, currentDate});
        });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/admin_remove_from_team',function(req,res){
    if (urole == 'admin')
    {
        const UserName = uname;
        res.render('admin/remove_from_team', { UserName });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/remove_from_team', function(req, res){
    if (urole == 'admin'){
        var team = req.query.team;
        var user = req.query.user;
        let query = "delete from user_team where uid = \""+user+"\" and tid = \""+team+"\";";
        connection.query(query, function(err, results){
            if (err) throw err;
        });
        res.redirect('/admin_teams');
    }
})

app.get('/admin_teams',function(req,res){
    if (urole == 'admin'){
        let query = "select * from team;";
        const pageTitle = uname + " ";
        const UserName = uname;
        const currentDate = new Date().toDateString();
        connection.query(query, function(err, results){
            console.log(results);
            res.render('admin/teams', { results, pageTitle, UserName, currentDate});
        });
    }
    else{
        res.status(403).send('Access Denied, user was not admin');
    }
});

app.get('/login', function(req, res) {
    var email = req.query.email;
    var password = req.query.password;
    let query = "select * from user where email=\"" + email + "\" and password = \"" + password + "\";";
    console.log(email, password);
    connection.query(query, function(err, result) {
      if (err) throw err;
      if (result && result.length > 0) {
        let query = "select role, name from user where email=\"" + email + "\" and password = \"" + password + "\";";
        connection.query(query, function(err, result1) {
          if (err) throw err;
          if (result1[0]['role'] == 'manager') {
            urole = result[0]['role'];
            uname = result[0]['name'];
            uid = result[0]['id'];
            res.redirect('/mgr_home');
          }
          if (result1[0]['role'] == 'admin') {
            urole = result[0]['role'];
            uname = result[0]['name'];
            res.redirect('/admin_home');
          }
          if (result1[0]['role'] == 'member') {
            urole = result[0]['role'];
            uname = result[0]['name'];
            uid = result[0]['id'];
            res.redirect('/member_home');
          }
          if (result1[0]['role'] == 'customer') {
            urole = result[0]['role'];
            uname = result[0]['name'];
            uid = result[0]['id'];
            res.redirect('/customer_home');
          }
        });
      } else {
        return res.sendFile(__dirname + "/errorPage.html");
      }
    })
});  

app.get("/newUser", function(req, res)
{
    res.sendFile(__dirname + "/signup.html")
})

app.get("/oldUser", function(req, response)
{
    response.sendFile(__dirname + "/login.html")
});

app.get('/signup', function(req, res){
    var username = req.query.username;
    var email = req.query.email;
    var password = req.query.password;
    var role = req.query.role;
    var address = req.query.address;
    var dob = req.query.dob;
    var gender = req.query.gender;
    let query = "insert into user (name, role, address, dob, gender, email, password) values (\""+username+"\", \""+role+"\", \""+address+"\", \""+dob+"\", \""+gender+"\", \""+email+"\", \""+password+"\");";
    let query1 = "select id, role from user where email = \""+email+"\";";
    connection.query(query1, function(err, results){
        if (err) throw err;
        uid = results.id;
        urole = results.role;
    });
    connection.query(query, function(err, results){
        if (err) throw err;
        console.log("ADDED NEW USER")
        return res.sendFile(__dirname + '/login.html');
    });
});

app.listen(port);
