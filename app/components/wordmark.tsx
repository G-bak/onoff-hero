export default function Wordmark() {
  return (
    <h1 className="hero-wordmark" aria-label="ON&OFF">
      <span className="wordmark-text" aria-hidden="true">{Array.from('ON&OFF').map((letter, index) => <span className={`wordmark-glyph${letter === '&' ? ' wordmark-amp' : ''}`} data-wordmark-letter={index} key={index}>{letter}</span>)}<span className="wordmark-baseline" data-wordmark-baseline/></span>
    </h1>
  );
}
