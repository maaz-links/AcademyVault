export default function Welcome() {
  return (
    <div style={{ padding: '30px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2c3e50' }}>Welcome!</h1>
      <p className="">
        This is a protected page. Only authenticated users can see this content.
      </p>
    </div>
  )
}
