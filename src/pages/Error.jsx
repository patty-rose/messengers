import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <section className='section'>
      <h2>Error</h2>
      <h2>404</h2>
      <p>Something went wrong.</p>
      <Link to='/' className='btn'>back home</Link>
    </section>
  );
};

export default Error;
