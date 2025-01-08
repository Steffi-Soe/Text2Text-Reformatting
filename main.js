import { GoogleGenerativeAI } from "@google/generative-ai";
import { maybeShowApiKeyBanner } from './gemini-api-banner.js';
import './style.css';

let API_KEY = 'AIzaSyCNXQuxcjnNk3-KwDoVgLYEVBVVINXvdGk'; // Replace with your actual API Key

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Generating...';

  try {
    const apiKey = API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
      });
      
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
    };

    const userPrompt = promptInput.value;

    const parts = [
      { text: `You are an expert in piping materials and flange terminology. Your task is to convert user-provided text descriptions into a consistent, short, standardized output string, similar to how a product might be described in a parts list. You should output the parts in a single line, with all relevant information in a standardized order, separated by spaces: Follow this output format:
[ITEM TYPE] [DEGREE] [RADIUS] [SMLS/WELDED] [CS/SS] [MATERIAL PART TYPE] [FACE] [CLASS] [SCHEDULE] [STANDARD] [SIZE] [BRAND].

Follow these general guidelines for structuring the output string:

1.  **Item Type:** Start with the most specific product name (e.g., "SWAGE NIPPLE", "BALL VALVE," "REDUCER"). Use short words, not phrases.
2.  **Type Descriptor:** If applicable, include any relevant descriptor like "ECCENTRIC", "CONCENTRIC", "FLEXIBLE", "TRUNNION", etc.
3.  **DEGREE:** End the numeric with DEG (e.g., "90 DEG")
4.  **SMLS/WELDED:** If the description states "SMLS", include "SMLS". Otherwise, don't mention this.
5.  **CS/SS:** If the product is carbon steel, include "CS"; if stainless steel, include "SS"
6. **Material Part Type**: Include the material type, code or grade description in this part (eg "A182 F304-304L" or "304", etc). if no material type information is present do not add it.
7. **Face**: if the product is flanged, and a face type (RF, FF, RTJ, etc) is present add it to the string.
8.  **CLASS:** Add the class rating if available (e.g., "150#", "300#").
9.  **SCHEDULE:** If a schedule is mentioned, include it (e.g., "SCH 40", "SCH 80/XS"). Add a 'x' to separate schedules if two schedules are present (e.g. SCH 40/40S x SCH 40/40S).
10.  **STANDARD:**  Include the material standard (e.g., "ASTM A105", "API 6D", "MSS SP-95"). If the description mentions "API 6D" also output it's implied material standards (e.g. "ASTM A105" if applicable)
11. **Size:** Output the size, including a second size if applicable.
12. **BRAND:** the brand of the product (e.g., "GBA", "BEBITZ", "CHINA", etc or "None").

Here are some examples to illustrate the output format:

Example 1
User Input: Ecc Swg, SS A403 WP304/304L Smls PBE Mss-sp-95 s-40s x s-40s 1" x 1/2"
Output: SWAGE NIPPLE ECCENTRIC SMLS SS A403 WP304-304L PBE SCH 40/40S x SCH 40/40S MSS SP-95 1" x 1/2"

Example 2
User Input: Fleksible Sus304 2" x 290 JIS 10KB
Output: FLEXIBLE METAL HOSE SS 304-304L 2" x 290 MM JIS 10K

Example 3
User Input: BALL VALVES 300#, 6" Flange type carbon steel ASTM A-105, Trunnion
Output: BALL VALVE TRUNNION CS A105 RF 300# ASTM 6D 6"

Example 4
User Input: REDUCER CONCENTRIC CS A234 WPB SCH 80/XS x 3"
Output: REDUCER CONCENTRIC CS A234 WPB SCH 80/XS 3"

Example 5
User Input: 12 Inch ASME B16.47 Series A Blind Flange Carbon Steel A105 RF
Output: BLIND FLANGE CS A105 RF 150# ASME B16.47 12"

Example 6:
User Input: BALL VALVES 150# Flange type carbon steel ASTM A-105, Floating Ball valves 150#, 1/2"
Output: BALL VALVE CS A105, FLOATING RF 150# ASTM 1/2"

Now, convert the following user input using the format above:
User Input: ${userPrompt}` },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });

    output.textContent = result.response.text();

  } catch (error) {
    console.error('Error:', error);
    output.textContent = 'An error occurred. Please try again.';
  }
};