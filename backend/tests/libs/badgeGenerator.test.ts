import { generateBadgeSvg } from '../../src/lib/badgeGenerator';

describe('badgeGenerator', () => {
  it('generates a valid SVG string containing the label and message', () => {
    const svg = generateBadgeSvg('Langage', 'JavaScript', 'blue');
    expect(svg).toContain('<svg');
    expect(svg).toContain('Langage');
    expect(svg).toContain('JavaScript');
  });

  it('escapes special SVG characters in label and message', () => {
    const label = '<Label&>';
    const message = 'Message"\'';
    const svg = generateBadgeSvg(label, message, 'green');
    expect(svg).toContain('&lt;Label&amp;&gt;');
    expect(svg).toContain('Message&quot;&apos;');
  });

  it('uses default labelColor when not provided', () => {
    const svg = generateBadgeSvg('Test', 'Value', 'red');
    expect(svg).toContain('fill="555"');
  });

  it('uses the given labelColor if provided', () => {
    const svg = generateBadgeSvg('Test', 'Value', 'red', '#123abc');
    expect(svg).toContain('fill="#123abc"');
  });

  it('includes the logo image tag with correct href and position left by default', () => {
    const logoData = {
      base64: 'abc123==',
      mimeType: 'image/png',
    };
    const svg = generateBadgeSvg('Label', 'Msg', 'orange', undefined, logoData);
    expect(svg).toContain(`xlink:href="data:image/png;base64,abc123=="`);
  
    expect(svg).toMatch(/<image x="5" y=".*" width="14" height="14" xlink:href="data:image\/png;base64,abc123=="/);
  });

  it('positions the logo on the right if logoPosition is "right"', () => {
    const logoData = {
      base64: 'def456==',
      mimeType: 'image/svg+xml',
    };
    const svg = generateBadgeSvg('Left', 'Right', 'purple', '444', logoData, 'white', 'right');
  
    expect(svg).toContain(`xlink:href="data:image/svg+xml;base64,def456=="`);
 
    const xMatch = svg.match(/<image x="(\d+)" y=".*" width="14" height="14" xlink:href="data:image\/svg\+xml;base64,def456=="/);
    expect(xMatch).not.toBeNull();
    if (xMatch) {
      const x = Number(xMatch[1]);
      expect(x).toBeGreaterThan(14);
    }
  });

  it('handles empty strings for label and message gracefully', () => {
    const svg = generateBadgeSvg('', '', 'black');
    expect(svg).toContain('<text');
  });

  it('returns a string containing valid SVG tags and attributes', () => {
    const svg = generateBadgeSvg('A', 'B', '#fff', '#000');
    expect(svg.startsWith('\n    <svg')).toBe(true);
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('width=');
    expect(svg).toContain('height=');
  });
});