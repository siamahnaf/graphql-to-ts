import { useState, useEffect } from "react";

//Components
import Title from "@/Components/Title";
import Footer from "@/Components/Footer";


//Seo
import Seo from "@/Components/Seo";

const Home = () => {
  const [schema, setSchema] = useState("");
  const [typescriptSchema, setTypescriptSchema] = useState("");
  const [copied, setCopied] = useState<boolean>(false);

  const convertSchema = () => {
    const lines = schema.split("\n");
    const types: string[] = [];

    let currentType: string | null = null;
    let fields: string[] = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("type")) {
        if (currentType !== null) {
          const typeDefinition = `interface ${currentType} {\n  ${fields.join("\n  ")}\n}\n`;
          types.push(typeDefinition);
        }

        currentType = trimmedLine.split(" ")[1];
        fields = [];
      } else if (currentType !== null && trimmedLine.includes(":")) {
        const fieldParts = trimmedLine.split(":");
        const fieldName = fieldParts[0].trim();
        const fieldType = fieldParts[1].trim().replace("!", "").trim();

        let tsType = "";

        if (fieldType === "Float" || fieldType === "Int") {
          tsType = "number";
        } else if (fieldType === "Boolean") {
          tsType = "boolean";
        } else if (fieldType === "DateTime") {
          tsType = "Date";
        } else if (fieldType === "ID") {
          tsType = "string"
        } else if (fieldType === "String") {
          tsType = "string"
        } else if (fieldType.startsWith("[")) {
          const innerType = fieldType.replace("[", "").replace("]", "").trim();
          let tsInnerType = ""
          if (innerType === "ID") {
            tsInnerType = "string"
          } else if (innerType === "Float" || innerType === "Int") {
            tsInnerType = "number"
          } else if (innerType === "DateTime") {
            tsInnerType = "Date"
          } else if (innerType === "String") {
            tsInnerType = "string"
          } else {
            tsInnerType = innerType
          }
          tsType = `${tsInnerType}[]`;
        } else {
          tsType = fieldType
        }
        const isRequired = !fieldParts[1].includes("!");
        console.log(isRequired)
        fields.push(`${fieldName}${isRequired ? "?" : ""}: ${tsType};`);
      }
    });

    if (currentType !== null) {
      const typeDefinition = `interface ${currentType} {\n  ${fields.join("\n  ")}\n}\n`;
      types.push(typeDefinition);
    }

    const typescriptCode = types.join("\n");

    setTypescriptSchema(typescriptCode);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(typescriptSchema)
      .then(() => {
        setCopied(true)
      })
  };

  //Lifecycle Hook
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copied]);

  return (
    <div>
      <Seo />
      <Title />
      <div className="px-10 py-1">
        <div className="grid grid-cols-12 items-center gap-4">
          <div className="col-span-5">
            <div className="h-[400px]">
              <textarea
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                placeholder="Enter GraphQL schema"
                className="text-base border border-solid border-gray-300 focus:outline-none w-full h-full p-5 rounded-lg"
              ></textarea>
            </div>
            <div className="mt-1">
              <button className="bg-gray-300 py-1 px-4 rounded hover:bg-red-600 hover:text-white transition-all" onClick={() => setSchema("")}>Clear</button>
            </div>
          </div>
          <div className="col-span-2 text-center">
            <button onClick={convertSchema} className="bg-green-600 text-white py-1.5 px-4 rounded">Convert to TypeScript</button>
          </div>
          <div className="col-span-5">
            <div className="h-[400px] overflow-auto border border-solid border-gray-300 p-5 rounded-lg">
              {typescriptSchema && (
                <pre>
                  <code>{typescriptSchema}</code>
                </pre>
              )}
            </div>
            <div className="text-right mt-1">
              <button className="bg-gray-300 py-1 px-4 rounded hover:bg-green-600 hover:text-white transition-all" onClick={copyToClipboard}>{copied ? "Copied" : "Copy"}</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
