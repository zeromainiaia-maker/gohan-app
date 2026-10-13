const shops = [
  { id: 1, name: 'らーめん太郎', genre: 'ラーメン', distance: 250, rating: 4.2, hours: '11:00〜22:00' },
  { id: 2, name: '寿司まる', genre: '寿司', distance: 600, rating: 4.5, hours: '17:00〜23:00' },
  { id: 3, name: 'カレー屋インド', genre: 'カレー', distance: 1200, rating: 3.8, hours: '11:30〜21:00' },
  { id: 4, name: 'カレー屋山下', genre: 'カレー', distance: 20000, rating: 5.0, hours: '00:00〜23:59' }
]




function App(){
  return(
    <div>
      <h1>ごはん探し</h1>
      <ul>
        {shops.map((shop) =>(
          <li key={shop.id}>
          {shop.name} {' '}
          ({shop.genre}/
          {shop.distance< 1000 ? shop.distance +"m":shop.distance/1000 +"km"}/
          {shop.rating.toFixed(1)}/
          {shop.hours})
          </li>
        ))}
      </ul>
    </div>
  )
}



export default App