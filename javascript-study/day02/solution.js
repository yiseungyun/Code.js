const users = [
  { name: 'Alice', lastLogin: '2024-12-01T10:00:00Z' },
  { name: 'Bob', lastLogin: '2025-06-27T08:00:00Z' },
  { name: 'Charlie', lastLogin: '2025-06-25T23:59:00Z' },
  { name: 'Daisy', lastLogin: '2025-06-27T00:01:00Z' },
  { name: 'Eve', lastLogin: '2025-06-20T18:00:00Z' },
];

const MS_IN_24_HOURS = 24*60*60*1000;

function getRecentUsers(users) { 
  const currentTime = Date.now();
  return users
    .filter((user) => {
      const diff = currentTime - new Date(user.lastLogin).getTime();
      return diff < MS_IN_24_HOURS;
    })
    .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
    .map((user) => {
      const date = new Date(user.lastLogin);
      const year = date.getFullYear();
      const month = (date.getMonth()+1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');;

      return `${user.name} (${year}-${month}-${day} ${hour}:${minute})`;
    });
}

console.log(getRecentUsers(users));