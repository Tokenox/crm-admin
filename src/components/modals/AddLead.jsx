import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import styles from '../../Styles/AddClients.module.css';

export default function AddClientModal() {
  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      alert('Please fill in all fields');
    }
    setName('');
    setEmail('');
    setPhone('');
    console.log(name, email, phone);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Lead
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Add Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className={styles.formRow}>
              <p> Name </p>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                type={'text'}
              />
            </div>
            <div className={styles.formRow}>
              <p>Email </p>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                type={'text'}
              />
            </div>

            <div className={styles.formRow}>
              <p>Phone Number </p>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                type={'text'}
              />
            </div>

            <div className={styles.submitButton}>
              <Button type="submit" onClick={onSubmit}>
                {' '}
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Import CSV</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
