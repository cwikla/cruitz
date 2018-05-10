class AddHeadLinks < ActiveRecord::Migration[5.1]
  def up
    Head.find_each(batch_size: 100) do |head|
      puts head.full_name
      head.links = []
      urls = Link::rando_fakes(head.full_name)
      urls.each do |l|
        puts "\t #{l}"
        link = head.links.create(url: l)
        puts link.inspect
      end
    end
  end

  def down
  end
end
