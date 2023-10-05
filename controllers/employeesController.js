const Employee= require('../model/Employee');
const { stringify } = require('querystring');

const getAllEmployees = async (req, res) => {
  const employees= await Employee.find();
  if (!employees) return res.status(204).json({'message':'No employees found.'});
  res.json(employees);
};

const createNewEmployee =async (req, res) => {
  if(!req?.body?.firstname || !req?.body?.lastname){
    return res.status(400).json({'message':'name required'})
  }

  try{
    const { firstname, lastname}=req.body;
    const result=await Employee.create({
      "firstname": firstname,
      "lastname": lastname
    });
    res.json(result);
  }catch(err){
    console.log(err);
  }
  
  
};

const updateEmployee = async (req, res) => {
  if(!req?.body?.id){
    return res.status(400).json({'message':'id required'})
  }
  const{ firstname, lastname}=req.body;
  const result= await Employee.findOneAndUpdate({"id": req.id},{
    "firstname": req.body.firstname,
    "lastname": req.body.lastname
  })
  res.json(result);

};

const deleteEmployee =async (req, res) => {
  if(!req?.body?.id){
    return res.status(400).json({'message':'id required'})
  }
  const result=await Employee.findOneAndDelete({id : req.id})
  res.sendStatus(204);
};

const getEmployee =async (req, res) => {
  const result= await Employee.findOne({
    "firstname":req.firstname,
    "lastname":req.lastname
  })
  res.json(result);
};


module.exports = {
    getAllEmployees,
    createNewEmployee, 
    updateEmployee,
    deleteEmployee,
    getEmployee
}
