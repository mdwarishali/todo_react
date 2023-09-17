import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { PopoverBody, Table } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import * as emailjs from 'emailjs-com';


const ToDo = () => {
  const [show, setShow] = useState(false);
  const [todo, setTodo] = useState(null);
  const [todoData, settodoData] = useState([]);
  const [editToggle, seteditToggle] = useState(false);
  const [rowindex, setRowindex] = useState(null);
  const [edittodo, setedittodo] = useState(null);
  const [search, setsearch] = useState('');
  const [userdata, setuserdata] = useState('All');

  console.log(userdata);

  const Pcount = todoData.filter((item) => item.status === "pending")
  const Ccount = todoData.filter((item) => item.status === "completed")

  const SERVICE_ID = "Warish_ToDo";
  const TEMPLATE_ID = "template_10";
  const USER_ID = "12";
  const TEMPLATE = "template_12";



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const submitTodo = () => {
    if (todo === null) {
     
      Toast(true, "Please enter todo")
    } else {
      let body = {
        todo: todo,
        status: "pending",
        createdAt: new Date().toDateString(),
        Assigntime: `${new Date().getHours()}:${new Date().getMinutes()}`,
        updateAt: null,
        UpdatedTime: null
      }

      axios.post('http://localhost:6300/todo', body).then((res) => {
        toast.success('Todo done')
        setTodo(null)
        if (res) {
          var data = {
            email_to: "alimdwarish628@gmail.com",
            from_name: localStorage.getItem('username'),
            Todo: todo
          };

          emailjs.send(SERVICE_ID, TEMPLATE_ID, data, USER_ID).then(
            function (response) {
              console.log(response.status, response.text);
            },
            function (err) {
              console.log(err);
            })
        }
        handleClose()
        getTodo()

      }).catch((err) => console.log(err))


    }

  }

  function handleClick() {

    var data = {
      to_email: "alimdwarish628@gmail.com",
      Todo: todo,
      from: "Warish"
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, TEMPLATE, data, USER_ID).then(
      function (response) {
        console.log(response.status, response.text);
      },
      function (err) {
        console.log(err);
      }
    );
  }

  const getTodo = () => {
    axios.get('http://localhost:6300/todo').then((res) => settodoData(res.data)).catch((err) => console.log(err))
  }

  const markasdone = (e, item) => {

    const { checked } = e.target;
    const { id } = item;
    var body;
    handleClick();


    if (markasdone) {
      var data = {
        email_to: "alimdwarish628@gmail.com",
        from_name: localStorage.getItem('username'),
        Todo: todo
      };

      emailjs.send(SERVICE_ID, TEMPLATE, data, USER_ID).then(
        function (response) {
          console.log(response.status, response.text);
        },
        function (err) {
          console.log(err);
        })

    }

    if (checked) {
      toast.info(`Status Updated at ${new Date}`)
      body = {
        status: "completed",
        updateAt: new Date().toDateString(),
        UpdatedTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
      }
    } else {

      body = {
        status: "pending",
        updateAt: null,
        UpdatedTime: null,


      }
    }
    axios.patch(`http://localhost:6300/todo/${id}`, body).then((res) => {
      getTodo()
    }).catch((err) => console.log(err))
  }
  const deleteTodo = (item) => {
    const { id } = item
    toast.success('Delete done')
    axios.delete(`http://localhost:6300/todo/${id}`).then((res) => getTodo()).catch((err) => console.log(err))

  }
  const edittodosubmit = (item) => {
    const { id } = item;
    let body = {
      todo: edittodo ? edittodo : item.todo
    }
    axios.patch(`http://localhost:6300/todo/${id}`, body).then((res) => {
      setedittodo(null);
      setRowindex(null);
      seteditToggle(false);
      getTodo();
    }).catch((err) => {
      console.log(err);
    })
  }
 
  const searchbar = todoData.filter((item) => {
    if (search === '') {
      return item
    }
    else if (item.todo.toLowerCase().includes(search.toLowerCase())) {
      return item
    }
  })
  console.log(searchbar);
  useEffect(() => {
    getTodo()
  }, [])

  const mapdata = (item, index) => {

    return (
      <tr key={index.toString()}>
        <td>{item.id}</td>
     
        <td><input type='checkbox' disabled={item.status == "completed" && true} defaultChecked={item.status == "completed" && "checked"} onClick={(e) => markasdone(e, item)} /></td>
        

        <td className={item.status === "completed" ? 'text-decoration-line-through' : ""}>{
          editToggle && rowindex === index ?
            <input defaultValue={item.todo} onChange={(e) => setedittodo(e.target.value)} />
            :
            item.todo
        }</td>

        <td className={item.status === 'pending' ? 'text-primary' : item.status === 'completed' && 'text-success'}>{item.status}</td>

        <td>{item.createdAt}</td>


        <td>{item.Assigntime?.split(':')[0] < 12 ? item.Assigntime + " AM" : item.Assigntime + "PM"
        }</td>
        <td>{item.UpdatedTime ? item.UpdatedTime.split(':')[0] < 12 ? item.UpdatedTime + " AM" : item.UpdatedTime + " PM" : '-'}</td>

        <td>{item.updateAt ? item.updateAt : '-'}</td>
        <td>
          <>
            {
              editToggle && rowindex === index ?
                (
                  <>
                    <button className='btn btn-sm btn-danger mx-3' onClick={() => seteditToggle(false)} >Cancel</button>
                    <button className=' btn btn-sm btn-success' onClick={() => edittodosubmit(item)}>Save</button>

                  </>
                ) :
                (
                  <>
                    <button className='btn btn-sm btn-danger mx-3' onClick={() => deleteTodo(item)} >Delete</button>

                    <button disabled={item.status === "completed"} className=' btn btn-sm btn-success' onClick={() => { setRowindex(index); seteditToggle(true) }}>Edit</button>
                  </>
                )
            }
          </>
        </td>
      </tr>
    )
  }

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">


          {/* <!-- start page title --> */}
          
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">To Do</h4>
              </div>
            </div>
          </div>
          

          <div className='d-flex justify-content-end'>
            <button className='mx-1 btn btn-sm btn btn-primary' onClick={() => setuserdata("All")}>ALL Todo{searchbar.length}</button>
            <button className='mx-2 btn btn-sm btn-success' onClick={() => setuserdata("complete")}>COMPLETED = {Ccount.length}</button>
            <button className='mx-1 btn btn-sm btn-warning' onClick={() => setuserdata("pending")}>PENDING = {Pcount.length}</button>
            <input className='right-todo' type='search' placeholder='Search' onInput={(e) => setsearch(e.target.value)} />
            <button className='mx-1 btn btn-sm btn-info' onClick={handleShow}>Add Todo</button>


          </div>
          <>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Todo</Modal.Title>
              </Modal.Header>
              <Modal.Body> <input className='form-control' placeholder='todo....' onChange={(e) => setTodo(e.target.value)} /></Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={submitTodo}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
          </>


          <Table striped bordered hover className='mt-4'>
            <thead>
              <tr>
                <th>Id</th>
                <th>Mark as done </th>
                <th>Todo</th>
                <th>Status</th>
                <th>createdAt</th>
                <th>Assigntime</th>
                <th>Updated Time</th>
                <th>UpdatedAt</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                userdata === "complete" ? Ccount.map(mapdata) : userdata === "pending" ? Pcount.map(mapdata) : userdata === "All" && searchbar.map(mapdata)
              }
            </tbody>
          </Table>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
export default ToDo