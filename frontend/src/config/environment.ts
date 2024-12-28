interface Environment {
  apiUrl: string;
  mode: 'development' | 'production';
}

const development: Environment = {
  apiUrl: 'http://localhost:3001/api',
  mode: 'development'
};

const production: Environment = {
  apiUrl: 'https://api.badmintonmaster.com', // Replace with your production API URL
  mode: 'production'
};

const environment = process.env.NODE_ENV === 'production' ? production : development;

export default environment; 