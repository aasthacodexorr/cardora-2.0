import re

with open("app/inventory/page.tsx", "r") as f:
    content = f.read()

# Define the new classNames variable
new_class_names = """const refinementListClassNames = {
  list: "space-y-3 pt-2 pb-4",
  label: "flex items-center gap-3 cursor-pointer text-[16px] text-gray-900 transition-colors",
  checkbox: "appearance-none h-[22px] w-[22px] rounded-[4px] border border-gray-800 bg-white checked:border-transparent checked:bg-transparent checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%2300AF66%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat checked:bg-[length:26px_26px] focus:ring-0 cursor-pointer",
  labelText: "flex-1",
  count: "bg-[#e6f7ec] text-gray-900 font-bold px-2.5 py-0.5 rounded-md text-[13px] ml-auto",
};

"""

# Insert the constant definition right before InventoryContent
content = content.replace("const InventoryContent = () => {", new_class_names + "const InventoryContent = () => {")

old_class_names = """                      classNames={{
                        list: "space-y-3 pt-2 pb-4",
                        label: "flex items-center gap-3 cursor-pointer text-[14px] text-gray-700 hover:text-brand-green transition-colors",
                        checkbox: "h-[18px] w-[18px] rounded-[4px] border-2 border-gray-300 bg-white checked:bg-brand-green checked:border-brand-green focus:ring-0",
                        labelText: "flex-1",
                        count: "text-gray-400 ml-auto bg-transparent px-0 text-sm font-normal",
                      }}"""

new_class_names_call = """                      classNames={refinementListClassNames}"""

content = content.replace(old_class_names, new_class_names_call)

with open("app/inventory/page.tsx", "w") as f:
    f.write(content)

print("Done updating")
