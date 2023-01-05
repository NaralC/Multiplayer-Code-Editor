const defaultCode: {
  [key: string]: string;
} = {
  JavaScript: `
const twoSum = (nums, target) => {
    
};
`,
  TypeScript: `
const twoSum = (nums: number[], target: number): number[] => {

};
    `,
  Python: `
def twoSum(nums, target):
    
`,
  "C++": `
class Main {
  public:
      vector<int> twoSum(vector<int>& nums, int target) {
          
      }
  };
`,
  Java: `
public class Main {
  public static void twoSum(int[] nums, int target) {
      
  }
}
`,
  PHP: `
class Main {
  function twoSum($nums, $target) {
      
  }
}
`,
  Rust: `
pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    
}
`,
};

export default defaultCode;
