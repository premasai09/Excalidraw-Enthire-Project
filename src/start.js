const express = require('express');
const newapp = express();
const path = require('path');
newapp.use(express.static('../public'));
qs = require('querystring');
var mysql = require('mysql')


newapp.set('views',path.join(__dirname,"./views"));
newapp.set('view engine','pug');
newapp.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname +'/first.html' ));
});
newapp.post('/save',(req,res)=>{
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'excali_svg_base'
    });
    connection.connect( (err) =>{
        if(err) throw err;
        console.log('Connected to database');
    });
    var body='';
            req.on('data', function (data) {
                body +=data;
            });
            req.on('end',function(){

                var POST =  qs.parse(body);
                console.log(POST.svgText);
                let verifyQuery = "SELECT filename FROM svg_data WHERE filename ='"+POST.Filename+"');"
                let saveQuery = "INSERT INTO svg_data values(" +"'"+ POST.Filename +"'"+ ",'" + POST.ver + "','" + POST.svgText + "');"
                // console.log(saveQuery);
                connection.query(saveQuery, (err)=>{
                    if(err){
                        res.sendStatus(404);
                    };
                    console.log("Sucessfully Saved");
                })
            });

});

newapp.get('/images',(req,res)=>{
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'excali_svg_base'
    });
    connection.connect( (err) =>{
        if(err) throw err;
        console.log('Connected to database');
    });
    var img;
    let getAllQuery = "SELECT filename,COUNT(version) as TotalImages FROM svg_data GROUP BY filename";
    connection.query(getAllQuery,(err,rows,fields)=>{
        if(err) throw err;
        console.log(rows);
        res.render("view_files",{rows})
    })
})

newapp.get('/Ver',(req,res)=>{
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'excali_svg_base'
    });
    connection.connect( (err) =>{
        if(err) throw err;
        console.log('Connected to database');
    });
    let svgQuery = "SELECT filename, version FROM svg_data WHERE filename='"+req.query.name+"';";
    connection.query(svgQuery,(err,rows,fields)=>{
        if(err){
            throw err
        }
        console.log(rows);
        res.render("view_ver",{rows})
        })
})

newapp.get('/download',(req,res)=>{
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'excali_svg_base'
    });
    connection.connect( (err) =>{
        if(err) throw err;
        console.log('Connected to database');
    });
    
    let svgGetQuery = "SELECT svgData FROM svg_data WHERE filename='"+req.query.name+"' AND version='"+req.query.ver+"';";
    console.log(svgGetQuery);
    connection.query(svgGetQuery,(err,rows,field)=>{
        if(err) throw err;
        console.log(rows);
        res.status(200)
        .attachment(`${req.query.name}-${req.query.ver}.svg`)
        .send(rows[0].svgData)
    })
    


})
port = process.env.PORT || 8080;
newapp.listen(port,()=>{
    console.log(`Listening on port ${port}.....`) 
});
