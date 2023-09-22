searchButton.addEventListener('click', () => {
  const username = searchInput.value.trim();

  if (username === '') {
      alert('Please enter a GitHub username.');
      return;
  }

  // GitHub API 호출 및 결과 표시
  fetch(`https://api.github.com/users/${username}`, {
      headers: {
          Authorization: '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', // 토큰 추가
      },
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      if (data.message === 'Not Found') {
          alert('User not found.');
          return;
      }

      // 사용자 프로필 표시
      const userProfile = `
        <img src="${data.avatar_url || ''}" alt="${username}" width="100">
        <h2> Name: ${data.name || 'No name available'}</h2>
        <p> Company: ${data.company || 'Empty'}</p>
        <p> Member Since: ${data.created_at || 'Empty'}</p>
        <p> Location: ${data.location || 'Empty'}</p>
        <a href="${data.html_url || '#'}" target="_blank">View GitHub Profile</a>
        <img src="https://ghchart.rshah.org/${username}" />
      `;
      profile.innerHTML = userProfile;

      // GitHub API를 사용하여 사용자의 공개 저장소 목록 조회
      fetch(`https://api.github.com/users/${username}/repos`, {
          headers: {
              Authorization: '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', // 토큰 추가
          },
      })
      .then(response => response.json())
      .then(repos => {
          // 최근 저장소 목록 표시
          const repoList = repos.map(repo => `<li>${repo.name}</li>`).join('');
          const recentRepos = `
            <h3>Recent Repositories:</h3>
            <ul>${repoList}</ul>
          `;
          profile.innerHTML += recentRepos;
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          alert('Failed to fetch data. Please try again later.');
      });
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      alert('Failed to fetch data. Please try again later.');
  });
});
