class AddCats < ActiveRecord::Migration[5.1]
  def up
    Category.reset_column_information

    path = Rails.root.join('db', 'data', 'cat.txt')
    
    File.open(path).readlines.each do |line|
      line = line.strip
    
      pieces = line.split("-");
    
      name = pieces[-1].strip
      main = pieces[0].strip
    
      puts "#{name} => #{main}"
    
      mcat = Category.where("lower(name) = ?", main.downcase).first
      mcat ||= Category.create(:name => main)
    
      ncat = Category.where("lower(name) = ?", name.downcase).first
      ncat ||= Category.create(:name => name)
    
      if ncat.id != mcat.id
        ncat.parent_id = mcat.id
        ncat.save
      end
    
    end
  end

  def down
    Category.reset_column_information
    Category.delete_all
  end
end
