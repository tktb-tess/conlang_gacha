const App = () => {
  const url = 'https://apps.tktb-tess.dev/conlang-gacha';
  return (
    <div className='grid place-content-center place-items-center min-h-screen'>
      <p>
        人工言語ガチャは
        <a href={url}>{url}</a>に移動しました。自動的に遷移します。
      </p>
      <p>移動しない場合はリンクをクリックしてください。</p>
    </div>
  );
};

export default App;
