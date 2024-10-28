import { Navbar, Container } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg='light' expand='lg'>
      <Container>
        <img alt='book icon' height='100px' src='/book.svg' width='100px' />
      </Container>
    </Navbar>
  );
};

export default Header;
