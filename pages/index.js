import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';
import { Dropdown } from "@nextui-org/react";
import * as React from 'react';


const Home = () => {
  const menuItems = [
    { key: "Javascript", name: "Javascript" },
    { key: "Python", name: "Python" },
    { key: "Solidity", name: "Solidity" },
    { key: "C", name: "C" },
    { key: "C++", name: "C++" }
  ];
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setAPIOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [language, setLanguage] = useState(new Set([menuItems[0].key]))



  // const selectedLanguage = React.useMemo(
  //   () => Array.from(language).join(", ").replaceAll("_", " "),
  //   [language]
  // );

  const onUserChangedText = (event) => {
    setUserInput(event.target.value)
  }

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    console.log(userInput)
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'applications/json',
      },
      body: JSON.stringify({ userInput, language }),
    });

    const data = await response.json();
    const { output } = data;
    console.log(`Open AI replied: ${output.text}`)

    setAPIOutput(`${output.text}`);
    setIsGenerating(false);
  }

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Explain My Code</h1>
          </div>
          <div className="header-subtitle">
            <h2>Code explanations, powered by GPT-3</h2>
          </div>
        </div>
        <div className='prompt-container'>
        <div className='language-selector'>
          <Dropdown>
          <Dropdown.Button flat>{language}</Dropdown.Button>
            <Dropdown.Menu 
            aria-label="Dynamic Actions" 
            items={menuItems}
            selectionMode='single'
            selectedKeys={language}
            onSelectionChange={setLanguage}>
              {(item) => (
                <Dropdown.Item
                key={item.key}
                color={item.key === "delete" ? "error" : "default"}
                >
                  {item.name}
                </Dropdown.Item> 
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
          <textarea 
          placeholder='Paste your code here (and please dont abuse my Open AI credits if you found this early lol)'
          className='prompt-box'
          value={userInput}
          onChange={onUserChangedText}
          />
        </div>
        <div className='prompt-buttons'>
            <a className={isGenerating? 'generate-button-loading' : 'generate-button'}
            onClick={callGenerateEndpoint}>
              <div className='generate'>
                {isGenerating? <span class="loader"></span> : <p>Generate</p>}
              </div>
            </a>
        </div>
        {
          apiOutput && (
            <div className="output">
                <div className='output-header-container'>
                    <div className='output-header'>
                        <h3>Output</h3>
                    </div>
                </div>
                <div className='output-content'>
                  <p>{apiOutput}</p>
                </div>
            </div>
          )
        }
      </div>
      <div className="email-capture">
        <h2>Do You Want This As a Chrome Extension?</h2>
        <h5>Enter Your Email for Updates</h5>
        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfRDM6pi0YVO_IbUnODpjv2Fbhw5Tq8sYrBaa71BiSmpUgTzA/viewform?embedded=true" width="640" height="451" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
      </div>
      {/* <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div> */}
    </div>
  );
};

export default Home;
